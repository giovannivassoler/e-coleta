"use server"

import { auth } from "@/lib/auth/config"
import { db } from "@/lib/db/client"
import { organization, enderecoTableEmp } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"

export async function updateEmpresa(
  tel: string,
  cnpj: string,
  slug: string,
  email: string,
  endereco?: {
    cep: string
    logradouro: string
    numero: string
    bairro: string
    cidade: string
    estado: string
    complemento?: string
  },
) {
  const sessao = await auth.api.getSession({
    headers: await headers(),
  })

  if (!sessao) {
    throw new Error("Não autorizado: Usuário não está autenticado")
  }

  // Remover caracteres não numéricos do CNPJ e telefone
  const cnpjLimpo = cnpj.replace(/[^\d]/g, "")
  const telLimpo = tel.replace(/[^\d]/g, "")

  try {
    // 1. Atualizar a organização com CNPJ e telefone
    const [resultado] = await db
      .update(organization)
      .set({
        cnpj: cnpjLimpo,
        tel_emp: telLimpo,
      })
      .returning()
      .where(eq(organization.slug, slug))

    if (!resultado) {
      return { status: "Erro", mensagem: "Não foi possível atualizar a empresa" }
    }

    // 2. Se temos dados de endereço, inserir na tabela de endereço
    if (endereco) {
      // Limpar o CEP, removendo caracteres não numéricos
      const cepLimpo = endereco.cep.replace(/[^\d]/g, "")
      const idEmpresa = resultado.id
      console.log("ID da empresa:", idEmpresa)

      // Inserir o endereço na tabela de endereços
      await db.insert(enderecoTableEmp).values({
        endereco_usu: endereco.logradouro,
        num_end: endereco.numero,
        bairro_end: endereco.bairro,
        cidade_end: endereco.cidade,
        estado_end: endereco.estado,
        complemento_end: endereco.complemento || null,
        cep_end: cepLimpo,
        id_empresa: idEmpresa, // Usar o ID da organização retornado
      })
    }

    return { status: "Sucesso", mensagem: "Empresa atualizada com sucesso" }
  } catch (error: unknown) {
    console.error("Erro ao atualizar empresa:", error)
    return {
      status: "Erro",
      mensagem: error instanceof Error ? error.message : "Erro ao atualizar empresa",
    }
  }
}

