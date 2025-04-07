"use server"

import { db } from "@/lib/db/client"
import { eq } from "drizzle-orm"
import { createHash, randomBytes } from "crypto"

// Importando as tabelas corretas do schema
import { user, account } from "@/lib/db/schema"

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

// Interface para os dados de atualização de senha
interface AtualizarSenhaParams {
  userId: string
  senhaAtual: string
  novaSenha: string
}

// Interface para o resultado da atualização de senha
interface ResultadoAtualizacaoSenha {
  success: boolean
  message?: string
}

// Função para verificar senha com formato salt:hash
function verificarSenhaComSaltSeparado(senha: string, hashArmazenado: string): boolean {
  console.log("Verificando senha com hash armazenado:", hashArmazenado)

  // Verificar se o hash armazenado tem o formato esperado (salt:hash)
  const partes = hashArmazenado.split(":")
  if (partes.length !== 2) {
    console.log("Formato de hash inválido, não contém ':'")
    return false
  }

  const salt = partes[0]
  const hashEsperado = partes[1]

  console.log("Salt extraído:", salt)
  console.log("Hash esperado:", hashEsperado)
  console.log("Comprimento do hash esperado:", hashEsperado.length)

  // Baseado nos logs anteriores, o hash parece ser SHA-512
  // Vamos tentar diferentes combinações de salt e senha

  // Método 1: SHA-512 com salt como prefixo
  const hashSHA512SaltPrefixo = createHash("sha512")
    .update(salt + senha)
    .digest("hex")

  // Método 2: SHA-512 com salt como sufixo
  const hashSHA512SaltSufixo = createHash("sha512")
    .update(senha + salt)
    .digest("hex")

  // Método 3: SHA-512 com salt como prefixo e sufixo
  const hashSHA512SaltAmbos = createHash("sha512")
    .update(salt + senha + salt)
    .digest("hex")

  console.log("Hashes calculados para comparação:")
  console.log("1. SHA-512 (salt+senha):", hashSHA512SaltPrefixo)
  console.log("2. SHA-512 (senha+salt):", hashSHA512SaltSufixo)
  console.log("3. SHA-512 (salt+senha+salt):", hashSHA512SaltAmbos)

  // Verificar se algum dos hashes gerados corresponde ao hash armazenado
  if (hashEsperado === hashSHA512SaltPrefixo) {
    console.log("Senha verificada com sucesso usando SHA-512 (salt+senha)")
    return true
  }

  if (hashEsperado === hashSHA512SaltSufixo) {
    console.log("Senha verificada com sucesso usando SHA-512 (senha+salt)")
    return true
  }

  if (hashEsperado === hashSHA512SaltAmbos) {
    console.log("Senha verificada com sucesso usando SHA-512 (salt+senha+salt)")
    return true
  }

  console.log("Nenhum método de verificação de senha correspondeu")
  return false
}

// Função para gerar hash com o mesmo formato usado no sistema
// Agora usando SHA-512 para compatibilidade com o sistema de login
function gerarHashComSalt(senha: string): string {
  // Gerar um salt aleatório (hexadecimal de 16 bytes)
  const salt = randomBytes(16).toString("hex")

  // Gerar o hash da senha usando SHA-512 com salt como prefixo
  // Este método deve ser compatível com o sistema de login
  const hash = createHash("sha512")
    .update(salt + senha)
    .digest("hex")

  console.log("Gerando nova senha com formato salt:hash")
  console.log("Salt gerado:", salt)
  console.log("Hash gerado (SHA-512):", hash)

  // Retornar no formato salt:hash
  return `${salt}:${hash}`
}

// Função para atualizar a senha do usuário diretamente no banco de dados
export async function atualizarSenha({
  userId,
  senhaAtual,
  novaSenha,
}: AtualizarSenhaParams): Promise<ResultadoAtualizacaoSenha> {
  try {
    console.log("Iniciando processo de atualização de senha para o usuário:", userId)
    console.log("Senha atual fornecida (primeiros caracteres):", senhaAtual.substring(0, 3) + "...")
    console.log("Nova senha fornecida (primeiros caracteres):", novaSenha.substring(0, 3) + "...")

    // 1. Buscar a conta do usuário no banco de dados
    const contaUsuario = await db.query.account.findFirst({
      where: eq(account.userId, userId),
      columns: {
        id: true,
        password: true,
      },
    })

    if (!contaUsuario) {
      console.error("Conta de usuário não encontrada")
      return {
        success: false,
        message: "Conta de usuário não encontrada",
      }
    }

    // Verificar se a senha está definida
    if (!contaUsuario.password) {
      console.error("Senha não definida para este usuário")
      return {
        success: false,
        message: "Senha não definida para este usuário",
      }
    }

    console.log("Conta encontrada, verificando senha atual")
    console.log("Hash armazenado no banco:", contaUsuario.password)

    // Verificar se a senha atual está correta usando o formato salt:hash
    const senhaCorreta = verificarSenhaComSaltSeparado(senhaAtual, contaUsuario.password)

    // IMPORTANTE: Modo de emergência DESATIVADO
    // A senha atual DEVE estar correta para permitir a atualização
    if (!senhaCorreta) {
      console.error("Senha atual incorreta - Atualização NEGADA")
      return {
        success: false,
        message: "Senha atual incorreta",
      }
    }

    console.log("Senha atual verificada com sucesso")

    // Gerar hash da nova senha usando o mesmo formato
    const novaSenhaHash = gerarHashComSalt(novaSenha)
    console.log("Nova senha hash gerada:", novaSenhaHash)

    // Atualizar a senha na tabela account
    await db
      .update(account)
      .set({
        password: novaSenhaHash,
        updatedAt: new Date(),
      })
      .where(eq(account.userId, userId))

    console.log("Senha atualizada com sucesso no banco de dados")

    return {
      success: true,
      message: "Senha atualizada com sucesso",
    }
  } catch (error: any) {
    console.error("Erro ao atualizar senha:", error)

    return {
      success: false,
      message: error.message || "Erro ao atualizar senha. Tente novamente mais tarde.",
    }
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

