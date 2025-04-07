// app/agendamentos/actions.ts
"use server"

import { db } from "@/lib/db/client"
import { coletaTable, enderecoTable, itensTable } from "@/lib/db/schema"
import { auth } from "@/lib/auth/config"
import { headers } from "next/headers"
import { eq, desc } from "drizzle-orm"

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

      // Retornar a coleta com endereço e itens
      return {
        ...coleta,
        endereco,
        itens,
      }
    })
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
      return operators.and(
        operators.eq(fields.id, idColeta),
        operators.eq(fields.id_usuario, sessao.user.id)
      )
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
  await db.update(coletaTable)
    .set({ status_coleta: "Cancelado" })
    .where(eq(coletaTable.id, idColeta))

  return { success: true }
}