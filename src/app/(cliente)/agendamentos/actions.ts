"use server"

import { db } from "@/lib/db/client"
import { coletaTable, enderecoTable, itensTable } from "@/lib/db/schema"
import { auth } from "@/lib/auth/config"
import { headers } from "next/headers"
import { eq, desc, and, sql } from "drizzle-orm"

export async function buscarAgendamentos() {
  // Obter o usuário atual
  const sessao = await auth.api.getSession({
    headers: await headers(),
  })

  if (!sessao?.user?.id) {
    throw new Error("Usuário não autenticado")
  }

  const idUsuario = sessao.user.id

  // Buscar todas as coletas do usuário
  const coletas = await db.query.coletaTable.findMany({
    where: eq(coletaTable.id_usuario, idUsuario),
    orderBy: (coleta) => desc(coleta.data_coleta),
  })

  // Para cada coleta, buscar o endereço e os itens
  const coletasCompletas = await Promise.all(
    coletas.map(async (coleta) => {
      // Buscar o endereço
      const endereco = await db.query.enderecoTable.findFirst({
        where: eq(enderecoTable.id_coleta, coleta.id),
      })

      // Buscar os itens
      const itens = await db.query.itensTable.findMany({
        where: eq(itensTable.id_coleta, coleta.id),
      })

      // Buscar solicitações de alteração de data/hora pendentes
      const alteracaoPendente = await verificarAlteracaoPendente(coleta.id)

      // Retornar a coleta com endereço, itens e informações de alteração pendente
      return {
        ...coleta,
        endereco,
        itens,
        alteracaoPendente: alteracaoPendente.temAlteracao
          ? {
              id: alteracaoPendente.id,
              dataHoraOriginal: alteracaoPendente.dataHoraOriginal,
              dataHoraProposta: alteracaoPendente.dataHoraProposta,
              empresaId: alteracaoPendente.empresaId,
            }
          : null,
      }
    }),
  )

  return coletasCompletas
}

// Nova função para cancelar uma coleta
export async function cancelarColeta(idColeta: string) {
  // Verificar autenticação
  const sessao = await auth.api.getSession({
    headers: await headers(),
  })

  if (!sessao?.user?.id) {
    throw new Error("Usuário não autenticado")
  }

  // Verificar se a coleta pertence ao usuário
  const coleta = await db.query.coletaTable.findFirst({
    where: (fields, operators) => {
      return operators.and(operators.eq(fields.id, idColeta), operators.eq(fields.id_usuario, sessao.user.id))
    },
  })

  if (!coleta) {
    throw new Error("Coleta não encontrada ou não pertence ao usuário")
  }

  // Verificar se a coleta pode ser cancelada (apenas status "Solicitado")
  if (coleta.status_coleta !== "Solicitado") {
    throw new Error("Apenas coletas com status 'Solicitado' podem ser canceladas")
  }

  // Atualizar o status da coleta para "Cancelado"
  await db.update(coletaTable).set({ status_coleta: "Cancelado" }).where(eq(coletaTable.id, idColeta))

  return { success: true }
}

// Função para verificar se existe uma alteração de data/hora pendente
export async function verificarAlteracaoPendente(idColeta: string) {
  try {
    // Buscar solicitação pendente
    const result = await db.execute(sql`
      SELECT id, data_hora_original, data_hora_proposta, empresa_id
      FROM alteracoes_data_hora 
      WHERE coleta_id = ${idColeta} 
      AND status = 'Pendente' 
      ORDER BY created_at DESC 
      LIMIT 1
    `)

    // Verificar se há resultados
    if (result && result.rows && result.rows.length > 0) {
      return {
        temAlteracao: true,
        id: String(result.rows[0].id),
        dataHoraOriginal: String(result.rows[0].data_hora_original),
        dataHoraProposta: String(result.rows[0].data_hora_proposta),
        empresaId: String(result.rows[0].empresa_id),
      }
    }

    return { temAlteracao: false }
  } catch (error) {
    console.error("Erro ao verificar alteração pendente:", error)
    return { temAlteracao: false }
  }
}

// Função para aceitar uma alteração de data/hora
export async function aceitarAlteracaoDataHora(idAlteracao: string, idColeta: string) {
  try {
    // Verificar autenticação
    const sessao = await auth.api.getSession({
      headers: await headers(),
    })

    if (!sessao?.user?.id) {
      throw new Error("Usuário não autenticado")
    }

    // Verificar se a coleta pertence ao usuário
    const coleta = await db.query.coletaTable.findFirst({
      where: and(eq(coletaTable.id, idColeta), eq(coletaTable.id_usuario, sessao.user.id)),
    })

    if (!coleta) {
      throw new Error("Coleta não encontrada ou não pertence ao usuário")
    }

    // Buscar a alteração pendente
    const result = await db.execute(sql`
      SELECT data_hora_proposta
      FROM alteracoes_data_hora 
      WHERE id = ${idAlteracao} 
      AND coleta_id = ${idColeta}
      AND status = 'Pendente'
    `)

    if (!result || !result.rows || result.rows.length === 0) {
      throw new Error("Solicitação de alteração não encontrada ou já foi processada")
    }

    // Converter explicitamente para string antes de passar para o construtor Date
    const dataHoraProposta = String(result.rows[0].data_hora_proposta)

    // Atualizar o status da alteração para "Aceito"
    await db.execute(sql`
      UPDATE alteracoes_data_hora
      SET status = 'Aceito'
      WHERE id = ${idAlteracao}
    `)

    // Atualizar a data/hora da coleta com a conversão explícita
    await db
      .update(coletaTable)
      .set({ data_coleta: new Date(dataHoraProposta) })
      .where(eq(coletaTable.id, idColeta))

    return { success: true }
  } catch (error) {
    console.error("Erro ao aceitar alteração de data/hora:", error)
    throw new Error(error instanceof Error ? error.message : "Erro ao aceitar alteração de data/hora")
  }
}

// Função para recusar uma alteração de data/hora
export async function recusarAlteracaoDataHora(idAlteracao: string, idColeta: string) {
  try {
    // Verificar autenticação
    const sessao = await auth.api.getSession({
      headers: await headers(),
    })

    if (!sessao?.user?.id) {
      throw new Error("Usuário não autenticado")
    }

    // Verificar se a coleta pertence ao usuário
    const coleta = await db.query.coletaTable.findFirst({
      where: and(eq(coletaTable.id, idColeta), eq(coletaTable.id_usuario, sessao.user.id)),
    })

    if (!coleta) {
      throw new Error("Coleta não encontrada ou não pertence ao usuário")
    }

    // Atualizar o status da alteração para "Recusado"
    await db.execute(sql`
      UPDATE alteracoes_data_hora
      SET status = 'Recusado'
      WHERE id = ${idAlteracao}
      AND coleta_id = ${idColeta}
      AND status = 'Pendente'
    `)

    return { success: true }
  } catch (error) {
    console.error("Erro ao recusar alteração de data/hora:", error)
    throw new Error(error instanceof Error ? error.message : "Erro ao recusar alteração de data/hora")
  }
}
