"use server"

import { auth } from "@/lib/auth/config"
import { db } from "@/lib/db/client"
import { organization, member, coletaTable, enderecoTable, itensTable, user, coletasRecusadas } from "@/lib/db/schema"
import { eq, and, isNull, or, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { desc } from "drizzle-orm"

// Interface para os dados retornados
interface ColetaCompleta {
  id: string
  status_coleta: string
  data_coleta: Date
  id_usuario: string
  id_empresa: string | null
  endereco?: {
    id: string
    endereco_usu: string
    num_end: string
    bairro_end: string
    cidade_end: string
    estado_end: string
    complemento_end?: string | null
    cep_end: string
  }
  itens: {
    id: string
    itens: string
    quantidade: number
    observacao?: string | null
  }[]
  usuario: {
    id: string
    name: string
    email: string
    tel_usu?: string | null
  }
}

// Função para buscar coletas associadas à empresa do usuário logado
// e coletas disponíveis (status "Solicitado" sem empresa associada)
export async function buscarColetasEmpresa() {
  try {
    // Obter a sessão do usuário
    const sessao = await auth.api.getSession({
      headers: await headers(),
    })

    if (!sessao) {
      throw new Error("Não autorizado: Usuário não está autenticado")
    }

    // Buscar a relação do usuário com a organização na tabela member
    const membroOrganizacao = await db.query.member.findFirst({
      where: eq(member.userId, sessao.user.id),
    })

    if (!membroOrganizacao) {
      throw new Error("Usuário não está associado a nenhuma empresa")
    }

    // Buscar a organização usando o ID encontrado na tabela member
    const empresaUsuario = await db.query.organization.findFirst({
      where: eq(organization.id, membroOrganizacao.organizationId),
    })

    if (!empresaUsuario) {
      throw new Error("Empresa não encontrada para este usuário")
    }

    // Buscar coletas que:
    // 1. Pertencem à empresa do usuário (qualquer status)
    // 2. OU têm status "Solicitado" e não estão associadas a nenhuma empresa
    const coletas = await db.query.coletaTable.findMany({
      where: or(
        eq(coletaTable.id_empresa, empresaUsuario.id),
        and(eq(coletaTable.status_coleta, "Solicitado"), isNull(coletaTable.id_empresa)),
      ),
      orderBy: [desc(coletaTable.data_coleta)],
    })

    // Array para armazenar os resultados completos
    const coletasCompletas: ColetaCompleta[] = []

    // Para cada coleta, buscar informações relacionadas
    for (const coleta of coletas) {
      const [isRecusada] = await db.select().from(coletasRecusadas).where(eq(coletasRecusadas.coletaId, coleta.id))

      if (isRecusada) continue

      // Buscar endereço
      const endereco = await db.query.enderecoTable.findFirst({
        where: eq(enderecoTable.id_coleta, coleta.id),
      })

      // Buscar itens
      const itens = await db.query.itensTable.findMany({
        where: eq(itensTable.id_coleta, coleta.id),
      })

      // Buscar usuário
      const usuario = await db.query.user.findFirst({
        where: eq(user.id, coleta.id_usuario),
        columns: {
          id: true,
          name: true,
          email: true,
          tel_usu: true,
        },
      })

      if (usuario) {
        // Adicionar coleta completa ao array
        coletasCompletas.push({
          ...coleta,
          endereco: endereco || undefined,
          itens: itens || [],
          usuario,
        })
      }
    }

    return coletasCompletas
  } catch (error: unknown) {
    console.error("Erro ao buscar coletas da empresa:", error)
    throw new Error(error instanceof Error ? error.message : "Erro ao buscar coletas da empresa")
  }
}

// Função para aceitar uma coleta
export async function aceitarColeta(coletaId: string) {
  try {
    // Obter a sessão do usuário
    const sessao = await auth.api.getSession({
      headers: await headers(),
    })

    if (!sessao) {
      throw new Error("Não autorizado: Usuário não está autenticado")
    }

    // Buscar a relação do usuário com a organização na tabela member
    const membroOrganizacao = await db.query.member.findFirst({
      where: eq(member.userId, sessao.user.id),
    })

    if (!membroOrganizacao) {
      throw new Error("Usuário não está associado a nenhuma empresa")
    }

    // Buscar a organização usando o ID encontrado na tabela member
    const empresaUsuario = await db.query.organization.findFirst({
      where: eq(organization.id, membroOrganizacao.organizationId),
    })

    if (!empresaUsuario) {
      throw new Error("Empresa não encontrada para este usuário")
    }

    // Verificar se a coleta existe e está disponível
    const coleta = await db.query.coletaTable.findFirst({
      where: and(
        eq(coletaTable.id, coletaId),
        eq(coletaTable.status_coleta, "Solicitado"),
        isNull(coletaTable.id_empresa),
      ),
    })

    if (!coleta) {
      throw new Error("Coleta não encontrada ou não está disponível para aceitação")
    }

    // Atualizar a coleta: associar à empresa e mudar status para "Confirmado"
    await db
      .update(coletaTable)
      .set({
        id_empresa: empresaUsuario.id,
        status_coleta: "Confirmado",
      })
      .where(eq(coletaTable.id, coletaId))

    return { success: true }
  } catch (error: unknown) {
    console.error("Erro ao aceitar coleta:", error)
    throw new Error(error instanceof Error ? error.message : "Erro ao aceitar coleta")
  }
}

// Função para recusar uma coleta (apenas remove da lista de disponíveis para esta empresa)
export async function recusarColeta(coletaId: string, organizationId: string) {
  try {
    // Verificar autenticação
    const sessao = await auth.api.getSession({
      headers: await headers(),
    })

    if (!sessao) {
      throw new Error("Não autorizado: Usuário não está autenticado")
    }

    await db.insert(coletasRecusadas).values({
      coletaId,
      organizationId,
    })
    return { success: true }
  } catch (error: unknown) {
    console.error("Erro ao recusar coleta:", error)
    throw new Error(error instanceof Error ? error.message : "Erro ao recusar coleta")
  }
}

// Função para atualizar o status de uma coleta
export async function atualizarStatusColeta(coletaId: string, novoStatus: string) {
  try {
    // Obter a sessão do usuário
    const sessao = await auth.api.getSession({
      headers: await headers(),
    })

    if (!sessao) {
      throw new Error("Não autorizado: Usuário não está autenticado")
    }

    // Buscar a relação do usuário com a organização na tabela member
    const membroOrganizacao = await db.query.member.findFirst({
      where: eq(member.userId, sessao.user.id),
    })

    if (!membroOrganizacao) {
      throw new Error("Usuário não está associado a nenhuma empresa")
    }

    // Buscar a organização usando o ID encontrado na tabela member
    const empresaUsuario = await db.query.organization.findFirst({
      where: eq(organization.id, membroOrganizacao.organizationId),
    })

    if (!empresaUsuario) {
      throw new Error("Empresa não encontrada para este usuário")
    }

    // Verificar se a coleta pertence à empresa
    const coleta = await db.query.coletaTable.findFirst({
      where: and(eq(coletaTable.id, coletaId), eq(coletaTable.id_empresa, empresaUsuario.id)),
    })

    if (!coleta) {
      throw new Error("Coleta não encontrada ou não pertence a esta empresa")
    }

    // Atualizar o status
    await db.update(coletaTable).set({ status_coleta: novoStatus }).where(eq(coletaTable.id, coletaId))

    return { success: true }
  } catch (error: unknown) {
    console.error("Erro ao atualizar status da coleta:", error)
    throw new Error(error instanceof Error ? error.message : "Erro ao atualizar status da coleta")
  }
}

// Função para solicitar alteração de data/hora da coleta
export async function solicitarAlteracaoDataHora(coletaId: string, novaDataHora: string) {
  try {
    // Obter a sessão do usuário
    const sessao = await auth.api.getSession({
      headers: await headers(),
    })

    if (!sessao) {
      throw new Error("Não autorizado: Usuário não está autenticado")
    }

    // Buscar a relação do usuário com a organização na tabela member
    const membroOrganizacao = await db.query.member.findFirst({
      where: eq(member.userId, sessao.user.id),
    })

    if (!membroOrganizacao) {
      throw new Error("Usuário não está associado a nenhuma empresa")
    }

    // Buscar a organização usando o ID encontrado na tabela member
    const empresaUsuario = await db.query.organization.findFirst({
      where: eq(organization.id, membroOrganizacao.organizationId),
    })

    if (!empresaUsuario) {
      throw new Error("Empresa não encontrada para este usuário")
    }

    // Verificar se a coleta existe e pertence à empresa
    const coleta = await db.query.coletaTable.findFirst({
      where: and(eq(coletaTable.id, coletaId), eq(coletaTable.id_empresa, empresaUsuario.id)),
    })

    if (!coleta) {
      throw new Error("Coleta não encontrada ou não pertence a esta empresa")
    }

    // Verificar se o status permite alteração de data/hora
    if (coleta.status_coleta !== "Confirmado" && coleta.status_coleta !== "Solicitado") {
      throw new Error("Só é possível alterar a data/hora de coletas com status 'Solicitado' ou 'Confirmado'")
    }

    // Registrar a solicitação de alteração usando SQL direto
    await db.execute(sql`
      INSERT INTO alteracoes_data_hora (
        coleta_id, 
        data_hora_original, 
        data_hora_proposta, 
        status, 
        solicitado_por, 
        empresa_id
      ) 
      VALUES (
        ${coletaId}, 
        ${coleta.data_coleta.toISOString()}, 
        ${novaDataHora}, 
        'Pendente', 
        'Empresa', 
        ${empresaUsuario.id}
      )
    `)

    // Aqui você poderia enviar uma notificação para o cliente
    // sobre a solicitação de alteração de data/hora

    return { success: true }
  } catch (error: unknown) {
    console.error("Erro ao solicitar alteração de data/hora:", error)
    throw new Error(error instanceof Error ? error.message : "Erro ao solicitar alteração de data/hora")
  }
}

// Função para verificar se existe uma solicitação de alteração pendente
export async function verificarSolicitacaoAlteracaoPendente(coletaId: string) {
  try {
    // Buscar solicitação pendente
    const result = await db.execute(sql`
      SELECT data_hora_proposta 
      FROM alteracoes_data_hora 
      WHERE coleta_id = ${coletaId} 
      AND status = 'Pendente' 
      ORDER BY created_at DESC 
      LIMIT 1
    `)

    // Verificar se há resultados
    if (result && result.rows && result.rows.length > 0) {
      return {
        temSolicitacao: true,
        dataHoraProposta: result.rows[0].data_hora_proposta ? String(result.rows[0].data_hora_proposta) : null,
      }
    }

    return { temSolicitacao: false, dataHoraProposta: null }
  } catch (error: unknown) {
    console.error("Erro ao verificar solicitação pendente:", error)
    return { temSolicitacao: false, dataHoraProposta: null }
  }
}
