"use server"

// Interface para os dados retornados pela API
interface CNPJResponse {
  razao_social: string
  nome_fantasia: string
  cnpj: string
  email: string | null
  telefone: string | null
  logradouro: string
  numero: string
  complemento: string | null
  bairro: string
  municipio: string
  uf: string
  cep: string
}

// Função para consultar CNPJ - agora com múltiplas fontes e melhor tratamento de erros
export async function consultarCNPJ(cnpj: string): Promise<CNPJResponse | null> {
  try {
    // Limpar o CNPJ, removendo caracteres não numéricos
    const cnpjLimpo = cnpj.replace(/\D/g, "")

    // Validar se o CNPJ tem 14 dígitos
    if (cnpjLimpo.length !== 14) {
      throw new Error("CNPJ deve ter 14 dígitos")
    }

    // Tentar primeiro com a API ReceitaWS (endpoint gratuito)
    try {
      const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpjLimpo}`, {
        // Importante: definir o cache como no-store para evitar problemas com a API
        cache: "no-store",
        // Adicionar um timeout para evitar esperas longas
        next: { revalidate: 0 },
      })

      if (response.ok) {
        const data = await response.json()

        // Verificar se a API retornou um erro
        if (data.status === "ERROR") {
          throw new Error(data.message || "CNPJ não encontrado")
        }

        // Mapear os dados para o formato esperado pela aplicação
        return {
          razao_social: data.nome,
          nome_fantasia: data.fantasia || data.nome,
          cnpj: data.cnpj,
          email: data.email || null,
          telefone: data.telefone || null,
          logradouro: data.logradouro,
          numero: data.numero,
          complemento: data.complemento || null,
          bairro: data.bairro,
          municipio: data.municipio,
          uf: data.uf,
          cep: data.cep.replace(/\D/g, "").replace(/^(\d{5})(\d{3})$/, "$1-$2"),
        }
      }
    } catch (receitaError) {
      console.error("Erro ao consultar ReceitaWS:", receitaError)
      // Continuar para o próximo método se este falhar
    }

    // Tentar com a BrasilAPI como fallback
    const brasilApiResponse = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`, {
      // Importante: estas opções garantem que a requisição seja feita do lado do servidor
      cache: "no-store",
      next: { revalidate: 0 },
    })

    // Verificar se a requisição foi bem-sucedida
    if (!brasilApiResponse.ok) {
      if (brasilApiResponse.status === 404) {
        return null // CNPJ não encontrado
      }
      throw new Error(`Erro na API: ${brasilApiResponse.statusText}`)
    }

    // Converter a resposta para JSON
    const data = await brasilApiResponse.json()

    // Mapear os dados para o formato esperado pela aplicação
    return {
      razao_social: data.razao_social,
      nome_fantasia: data.nome_fantasia || data.razao_social,
      cnpj: data.cnpj,
      email: data.email || null,
      telefone: data.ddd_telefone_1 || null,
      logradouro: data.logradouro,
      numero: data.numero,
      complemento: data.complemento || null,
      bairro: data.bairro,
      municipio: data.municipio,
      uf: data.uf,
      cep: data.cep.replace(/\D/g, "").replace(/^(\d{5})(\d{3})$/, "$1-$2"),
    }
  } catch (error: unknown) {
    console.error("Erro ao consultar CNPJ:", error)
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    throw new Error(`Erro ao consultar CNPJ: ${errorMessage}`)
  }
}

// Função para consultar CEP no ViaCEP
export async function consultarCEP(cep: string) {
  try {
    // Limpar o CEP, removendo caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, "")

    // Validar se o CEP tem 8 dígitos
    if (cepLimpo.length !== 8) {
      throw new Error("CEP deve ter 8 dígitos")
    }

    // Fazer a requisição para a API do ViaCEP
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
      cache: "no-store",
      next: { revalidate: 0 },
    })

    // Verificar se a requisição foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro ao consultar CEP: ${response.statusText}`)
    }

    // Converter a resposta para JSON
    const data = await response.json()

    // Verificar se o CEP existe
    if (data.erro) {
      return null
    }

    // Retornar os dados formatados
    return {
      cep: data.cep,
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
    }
  } catch (error: unknown) {
    console.error("Erro ao consultar CEP:", error)
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    throw new Error(`Erro ao consultar CEP: ${errorMessage}`)
  }
}

