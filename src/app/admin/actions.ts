"use server"

import { db } from "@/lib/db/client"
import { user, organization, coletaTable, enderecoTable, itensTable, member } from "@/lib/db/schema"
import { eq, count, desc } from "drizzle-orm"

// Função para buscar todos os usuários
export async function buscarUsuarios() {
  try {
    // Buscar todos os usuários
    const usuarios = await db.query.user.findMany({
      orderBy: (user) => desc(user.createdAt),
    })

    // Para cada usuário, contar o número de coletas
    const usuariosCompletos = await Promise.all(
      usuarios.map(async (usuario) => {
        // Contar coletas do usuário
        const coletasResult = await db
          .select({ count: count() })
          .from(coletaTable)
          .where(eq(coletaTable.id_usuario, usuario.id))

        const totalColetas = coletasResult[0]?.count || 0

        // Verificar se o usuário é membro de alguma organização (empresa)
        const membroResult = await db.query.member.findFirst({
          where: eq(member.userId, usuario.id),
        })

        // Se for membro de uma organização, não é considerado cliente
        if (membroResult) {
          return null
        }

        // Retornar usuário com informações adicionais
        return {
          ...usuario,
          totalColetas,
        }
      }),
    )

    // Filtrar usuários nulos (membros de organizações)
    return usuariosCompletos.filter((usuario) => usuario !== null)
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    throw new Error("Não foi possível buscar os usuários")
  }
}

// Função para buscar todas as empresas
export async function buscarEmpresas() {
  try {
    // Buscar todas as organizações (empresas)
    const empresas = await db.query.organization.findMany({
      orderBy: (org) => org.name,
    })

    // Para cada empresa, buscar informações adicionais
    const empresasCompletas = await Promise.all(
      empresas.map(async (empresa) => {
        // Contar o número de coletas da empresa
        const coletasResult = await db
          .select({ count: count() })
          .from(coletaTable)
          .where(eq(coletaTable.id_empresa, empresa.id))

        const totalColetas = coletasResult[0]?.count || 0

        // Buscar o email do primeiro membro da empresa (geralmente o dono)
        const membroResult = await db.query.member.findFirst({
          where: eq(member.organizationId, empresa.id),
        })

        let email = null
        if (membroResult) {
          const userResult = await db.query.user.findFirst({
            where: eq(user.id, membroResult.userId),
            columns: {
              email: true,
            },
          })
          email = userResult?.email || null
        }

        // Retornar empresa com informações adicionais
        return {
          ...empresa,
          totalColetas,
          email,
        }
      }),
    )

    return empresasCompletas
  } catch (error) {
    console.error("Erro ao buscar empresas:", error)
    throw new Error("Não foi possível buscar as empresas")
  }
}

// Função para buscar coletas de um usuário específico
export async function buscarColetasUsuario(usuarioId: string) {
  try {
    // Buscar coletas do usuário
    const coletas = await db.query.coletaTable.findMany({
      where: eq(coletaTable.id_usuario, usuarioId),
      orderBy: (coleta) => desc(coleta.data_coleta),
    })

    // Para cada coleta, buscar informações adicionais
    const coletasCompletas = await Promise.all(
      coletas.map(async (coleta) => {
        // Buscar endereço da coleta
        const endereco = await db.query.enderecoTable.findFirst({
          where: eq(enderecoTable.id_coleta, coleta.id),
        })

        // Buscar itens da coleta
        const itens = await db.query.itensTable.findMany({
          where: eq(itensTable.id_coleta, coleta.id),
        })

        // Buscar informações da empresa (se houver)
        let empresa = null
        if (coleta.id_empresa) {
          empresa = await db.query.organization.findFirst({
            where: eq(organization.id, coleta.id_empresa),
            columns: {
              name: true,
            },
          })
        }

        // Retornar coleta com informações adicionais
        return {
          ...coleta,
          endereco,
          itens,
          empresa,
        }
      }),
    )

    return coletasCompletas
  } catch (error) {
    console.error("Erro ao buscar coletas do usuário:", error)
    throw new Error("Não foi possível buscar as coletas do usuário")
  }
}

// Função para buscar coletas de uma empresa específica
export async function buscarColetasEmpresa(empresaId: string) {
  try {
    // Buscar coletas da empresa
    const coletas = await db.query.coletaTable.findMany({
      where: eq(coletaTable.id_empresa, empresaId),
      orderBy: (coleta) => desc(coleta.data_coleta),
    })

    // Para cada coleta, buscar informações adicionais
    const coletasCompletas = await Promise.all(
      coletas.map(async (coleta) => {
        // Buscar endereço da coleta
        const endereco = await db.query.enderecoTable.findFirst({
          where: eq(enderecoTable.id_coleta, coleta.id),
        })

        // Buscar itens da coleta
        const itens = await db.query.itensTable.findMany({
          where: eq(itensTable.id_coleta, coleta.id),
        })

        // Buscar informações do usuário
        const usuario = await db.query.user.findFirst({
          where: eq(user.id, coleta.id_usuario),
          columns: {
            name: true,
            email: true,
          },
        })

        // Retornar coleta com informações adicionais
        return {
          ...coleta,
          endereco,
          itens,
          usuario,
        }
      }),
    )

    return coletasCompletas
  } catch (error) {
    console.error("Erro ao buscar coletas da empresa:", error)
    throw new Error("Não foi possível buscar as coletas da empresa")
  }
}
