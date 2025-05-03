"use server"

import { db } from "@/lib/db/client"
import type { FormData } from "./hooks/use-form-data"
import { coletaTable, itensTable, enderecoTable } from "@/lib/db/schema"
import { auth } from "@/lib/auth/config"
import { headers } from "next/headers"

function criarDataHora(data: string, horario: string) {
  // Separar a data em dia, mês e ano
  const [dia, mes, ano] = data.split("/")

  // Separar o horário em horas e minutos
  const [hora, minutos] = horario.split(":")

  // Criar o objeto Date com os valores
  // Mês em JavaScript é baseado em zero (0-11), então subtraímos 1
  const dataHora = new Date(
    Number.parseInt(ano),
    Number.parseInt(mes) - 1,
    Number.parseInt(dia),
    Number.parseInt(hora),
    Number.parseInt(minutos),
  )

  return dataHora
}

export async function criarPedido(formData: FormData) {
  const sessao = await auth.api.getSession({
    headers: await headers(),
  })

  const idUsuario = sessao?.user.id
  if (!idUsuario) {
    throw new Error("Usuário não autenticado")
  }

  const dataHoraColeta = criarDataHora(formData.data, formData.horario)

  // 1. Inserir na tabela de coleta e obter o ID (sem destinacao_final)
  const coleta = await db
    .insert(coletaTable)
    .values({
      data_coleta: dataHoraColeta,
      destinacao_final: null, 
      id_usuario: idUsuario,
      status_coleta: "Solicitado",
    })
    .returning({
      id: coletaTable.id,
    })

  const idColeta = coleta[0].id

  // 2. Inserir o endereço na tabela de endereços
  await db.insert(enderecoTable).values({
    endereco_usu: formData.endereco,
    num_end: formData.numero,
    bairro_end: formData.bairro,
    cidade_end: formData.cidade,
    estado_end: formData.estado,
    complemento_end: formData.complemento || null,
    cep_end: formData.cep.replace(/\D/g, ""), // Remove caracteres não numéricos do CEP
    id_coleta: idColeta,
  })

  // 3. Inserir os itens selecionados na tabela de itens
  const itensParaInserir = []

  // Mapeamento dos tipos de itens para nomes mais legíveis
  const nomesItens = {
    computador: "Computador",
    monitores: "Monitor",
    pilhasBaterias: "Pilhas e baterias",
    celulares: "Celular",
    televisores: "Televisor",
    eletrodomesticos: "Eletrodoméstico",
    outros: "Outros",
  }

  // Percorrer todos os tipos de itens
  for (const [tipo, selecionado] of Object.entries(formData.itensDescarte)) {
    // Se o item foi selecionado
    if (selecionado) {
      // Obter a quantidade e observação para este item
      const quantidade = formData.quantidades[tipo as keyof typeof formData.quantidades]
      const observacao = formData.observacoes[tipo as keyof typeof formData.observacoes]

      // Adicionar à lista de itens para inserir
      itensParaInserir.push({
        itens: nomesItens[tipo as keyof typeof nomesItens],
        quantidade: quantidade,
        observacao: observacao,
        id_coleta: idColeta,
      })
    }
  }

  // Se houver itens para inserir
  if (itensParaInserir.length > 0) {
    // Inserir todos os itens de uma vez
    await db.insert(itensTable).values(itensParaInserir)
  }

  return { id: idColeta }
}

