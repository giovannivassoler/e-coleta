"use server"

import { db } from "@/lib/db/client"
import { eq } from "drizzle-orm"


// Importando as tabelas corretas do schema
import { user } from "@/lib/db/schema"

// Interface para os dados do usuário
interface Usuario {
  id: string
  name: string
  email: string
  cpf_usu: string | null
  tel_usu: string | null
}

// Função para formatar telefone no padrão (11) 00000-0000
function formatarTelefone(telefone: string | null): string | null {
  if (!telefone) return null

  // Remove todos os caracteres não numéricos
  const numeros = telefone.replace(/\D/g, "")

  // Verifica se tem a quantidade mínima de dígitos
  if (numeros.length < 10) return telefone

  // Formata o telefone no padrão (11) 00000-0000
  if (numeros.length === 11) {
    return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 7)}-${numeros.substring(7)}`
  }

  // Formata telefone fixo (10 dígitos) no padrão (11) 0000-0000
  if (numeros.length === 10) {
    return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 6)}-${numeros.substring(6)}`
  }

  // Se tiver mais ou menos dígitos, retorna como está
  return telefone
}

// Função para buscar dados do usuário
export async function buscarUsuario(userId: string): Promise<Usuario | null> {
  try {
    // Buscar usuário no banco de dados
    const usuario = await db.query.user.findFirst({
      where: eq(user.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
        cpf_usu: true,
        tel_usu: true,
      },
    })

    // Se não encontrou o usuário, retorna null
    if (!usuario) return null

    // Aplica a formatação ao telefone
    return {
      ...usuario,
      tel_usu: formatarTelefone(usuario.tel_usu),
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    throw new Error("Não foi possível buscar os dados do usuário")
  }
}




// Função para atualizar os dados do usuário
export async function atualizarUsuario(
  userId: string,
  dados: { name: string; tel_usu: string; email: string },
): Promise<{ success: boolean; message?: string }> {
  try {
    // Atualizar os dados do usuário
    await db
      .update(user)
      .set({
        name: dados.name,
        tel_usu: dados.tel_usu,
        email: dados.email,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId))

    return {
      success: true,
      message: "Dados atualizados com sucesso",
    }
  } catch (error) {
    console.error("Erro ao atualizar dados do usuário:", error)
    return {
      success: false,
      message: "Erro ao atualizar dados. Tente novamente mais tarde.",
    }
  }
}

