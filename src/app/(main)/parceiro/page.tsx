"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowRight, Loader2, Search, AlertCircle, CheckCircle, Users, TrendingUp, Award, Shield, Calendar } from "lucide-react"
import { Separator } from "@/components/ui/separator"

import { organization, useSession } from "@/lib/auth/client"
import { updateEmpresa } from "./funcoes"
import { consultarCNPJ, consultarCEP } from "./buscarCnpj"

// Interface para os dados da empresa
interface DadosEmpresa {
  razaoSocial: string
  email: string
  telefone: string
  cep: string
  endereco: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  complemento: string
}

export default function PartnerPage() {
  // Estados para os campos do formulário
  const [cnpj, setCnpj] = useState("")
  const [dadosEmpresa, setDadosEmpresa] = useState<DadosEmpresa>({
    razaoSocial: "",
    email: "",
    telefone: "",
    cep: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    complemento: "",
  })

  // Estados para controle de UI
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSearchingCnpj, setIsSearchingCnpj] = useState(false)
  const [isSearchingCep, setIsSearchingCep] = useState(false)
  const [error, setError] = useState("")
  const [cnpjError, setCnpjError] = useState("")
  const [success, setSuccess] = useState("")
  const [cnpjFound, setCnpjFound] = useState(false)

  const sessao = useSession()
  const router = useRouter()

  // Verificar se o usuário está logado
  useEffect(() => {
    if (sessao.data === null && sessao.isPending === false) {
      router.push("/login")
    }
  }, [sessao, router])

  // Função para formatar CNPJ
  const formatarCNPJ = (valor: string) => {
    return valor
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 18)
  }

  // Função para remover caracteres especiais do CNPJ
  const limparCNPJ = (cnpj: string) => {
    return cnpj.replace(/[^\d]/g, "")
  }

  // Função para formatar telefone
  const formatarTelefone = (valor: string) => {
    return valor
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
      .substring(0, 15)
  }



  // Função para formatar CEP
  const formatarCEP = (valor: string) => {
    return valor
      .replace(/\D/g, "")
      .replace(/^(\d{5})(\d)/, "$1-$2")
      .substring(0, 9)
  }

  // Função para validar CNPJ
  const validarCNPJ = (cnpj: string) => {
    const cnpjLimpo = limparCNPJ(cnpj)

    // Verifica se tem 14 dígitos
    if (cnpjLimpo.length !== 14) {
      return false
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cnpjLimpo)) {
      return false
    }

    return true
  }

  // Função para buscar dados da empresa pelo CNPJ
  const buscarDadosCNPJ = async () => {
    if (!validarCNPJ(cnpj)) {
      setCnpjError("CNPJ inválido. Por favor, verifique o número informado.")
      return
    }

    setCnpjError("")
    setIsSearchingCnpj(true)
    setCnpjFound(false)

    try {
      // Consultar a API de CNPJ via server action
      const dadosCNPJ = await consultarCNPJ(cnpj)

      if (dadosCNPJ) {
        // Preencher os campos com os dados retornados
        setDadosEmpresa({
          razaoSocial: dadosCNPJ.razao_social,
          email: dadosCNPJ.email || "",
          telefone: dadosCNPJ.telefone ? formatarTelefone(dadosCNPJ.telefone) : "",
          cep: dadosCNPJ.cep,
          endereco: dadosCNPJ.logradouro,
          numero: dadosCNPJ.numero,
          bairro: dadosCNPJ.bairro,
          cidade: dadosCNPJ.municipio,
          estado: dadosCNPJ.uf,
          complemento: dadosCNPJ.complemento || "",
        })
        setCnpjFound(true)
      } else {
        // CNPJ válido mas não encontrado
        setCnpjError("CNPJ válido, mas não encontramos dados cadastrados. Por favor, preencha os campos manualmente.")
      }
    } catch (error: any) {
      setCnpjError(error.message || "Erro ao consultar o CNPJ. Tente novamente ou preencha os campos manualmente.")
      console.error("Erro ao buscar dados do CNPJ:", error)
    } finally {
      setIsSearchingCnpj(false)
    }
  }

  // Função para buscar endereço pelo CEP
  const buscarEnderecoPorCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, "")

    if (cepLimpo.length !== 8) {
      return
    }

    setIsSearchingCep(true)

    try {
      // Consultar a API de CEP
      const dadosCEP = await consultarCEP(cep)

      if (dadosCEP) {
        // Preencher os campos de endereço
        setDadosEmpresa((prev) => ({
          ...prev,
          endereco: dadosCEP.logradouro,
          bairro: dadosCEP.bairro,
          cidade: dadosCEP.cidade,
          estado: dadosCEP.estado,
        }))
      }
    } catch (error) {
      console.error("Erro ao buscar endereço pelo CEP:", error)
    } finally {
      setIsSearchingCep(false)
    }
  }

  // Handler para mudança no campo de CEP
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cepFormatado = formatarCEP(e.target.value)
    setDadosEmpresa((prev) => ({ ...prev, cep: cepFormatado }))

    // Se o CEP tiver 8 dígitos, busca o endereço
    if (e.target.value.replace(/\D/g, "").length === 8) {
      buscarEnderecoPorCEP(e.target.value)
    }
  }

  // Handler para mudança nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Formatação específica para alguns campos
    if (name === "telefone") {
      setDadosEmpresa((prev) => ({ ...prev, [name]: formatarTelefone(value) }))
    } else if (name === "cep") {
      handleCepChange(e)
    } else {
      setDadosEmpresa((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Função para enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações básicas
    if (
      !dadosEmpresa.razaoSocial ||
      !cnpj ||
      !dadosEmpresa.telefone ||
      !dadosEmpresa.cep ||
      !dadosEmpresa.endereco ||
      !dadosEmpresa.numero ||
      !dadosEmpresa.bairro ||
      !dadosEmpresa.cidade ||
      !dadosEmpresa.estado
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    // Validar CNPJ
    if (!validarCNPJ(cnpj)) {
      setError("CNPJ inválido. Por favor, verifique o número informado.")
      return
    }

    try {
      setIsSubmitting(true)
      setError("")

      // Criar slug a partir da razão social - substituir TODOS os espaços, não apenas o primeiro
      const slug = dadosEmpresa.razaoSocial.replace(/\s+/g, "-").toLowerCase()

      // Criar organização
      await organization.create(
        {
          name: dadosEmpresa.razaoSocial,
          slug: slug,
        },
        {
          onSuccess: async () => {
            if (!sessao.data) return

            // Atualizar dados da empresa
            const resultado = await updateEmpresa(
              dadosEmpresa.telefone, // Será limpo na função updateEmpresa
              cnpj, // Será limpo na função updateEmpresa
              slug,
              dadosEmpresa.email || sessao.data.user.email,
              {
                cep: dadosEmpresa.cep,
                logradouro: dadosEmpresa.endereco,
                numero: dadosEmpresa.numero,
                bairro: dadosEmpresa.bairro,
                cidade: dadosEmpresa.cidade,
                estado: dadosEmpresa.estado,
                complemento: dadosEmpresa.complemento || undefined,
              },
            )

            if (resultado?.status === "Erro") {
              setError("Erro ao atualizar dados da empresa: " + (resultado.mensagem || ""))
            } else {
              setSuccess("Cadastro realizado com sucesso! Em breve entraremos em contato.")

              // Limpar formulário após sucesso
              setCnpj("")
              setDadosEmpresa({
                razaoSocial: "",
                email: "",
                telefone: "",
                cep: "",
                endereco: "",
                numero: "",
                bairro: "",
                cidade: "",
                estado: "",
                complemento: "",
              })
              setCnpjFound(false)

              // Redirecionar após 3 segundos
              setTimeout(() => {
                router.push("/dashboard-empresa")
              }, 3000)
            }
          },
          onError: (error: any) => {
            setError("Erro ao criar a empresa: " + (error.message || "Erro desconhecido"))
          },
        },
      )
    } catch (err: any) {
      setError("Ocorreu um erro ao processar sua solicitação: " + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto py-16 px-4 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800">
                Parceria Estratégica
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-green-800">
                Torne-se um Parceiro e Expanda seus Negócios
              </h1>
              <p className="text-lg text-gray-600 max-w-xl">
                Junte-se à nossa plataforma e conecte-se com clientes que precisam dos seus serviços de coleta de lixo
                eletrônico.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#form-parceiro">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg h-auto">
                    Quero ser Parceiro
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
              <Image src="/imagens/img-coleta.jpg" alt="Parceria de negócios" fill className="object-cover" priority />
            </div>
          </div>
        </div>
      </section>
      {/* Why Partner With Us */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Por que se tornar nosso parceiro?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nossa plataforma conecta sua empresa diretamente a clientes que precisam dos seus serviços de coleta de
              lixo eletrônico, oferecendo diversas vantagens para o crescimento do seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="p-4 rounded-full bg-green-100 text-green-600 w-fit mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold text-green-800">Aumento de Clientes</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600">
                  Acesse uma base crescente de clientes que buscam serviços de coleta de lixo eletrônico. Nossa
                  plataforma direciona clientes qualificados diretamente para você.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="p-4 rounded-full bg-green-100 text-green-600 w-fit mb-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold text-green-800">Crescimento de Receita</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600">
                  Aumente seu volume de coletas e, consequentemente, sua receita. Nossos parceiros relatam um aumento
                  médio de 30% no volume de negócios após se juntarem à plataforma.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="p-4 rounded-full bg-green-100 text-green-600 w-fit mb-4">
                  <Award className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold text-green-800">Credibilidade</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600">
                  Ganhe visibilidade e
                  credibilidade como uma empresa comprometida com a sustentabilidade.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works For Partners */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Como Funciona para Parceiros</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Entenda como nossa plataforma conecta sua empresa aos clientes e facilita todo o processo de coleta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <CardTitle className="text-xl font-bold text-green-800">Cadastro</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600">
                  Preencha o formulário de parceria com os dados da sua empresa
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <CardTitle className="text-xl font-bold text-green-800">Verificação</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600">
                  Nossa equipe verifica suas credenciais e certificações para garantir que você atende aos nossos
                  padrões de qualidade.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <CardTitle className="text-xl font-bold text-green-800">Integração</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600">
                  Após aprovação, sua empresa é integrada à nossa plataforma e começa a receber solicitações de coleta
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white mb-4">
                  <span className="text-xl font-bold">4</span>
                </div>
                <CardTitle className="text-xl font-bold text-green-800">Crescimento</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600">
                  Gerencie suas coletas e expanda seus negócios com nossa plataforma.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits in Detail */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 w-fit mb-4">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-green-800 mb-2">Agendamento Flexível</h3>
                  <p className="text-gray-600">
                    Gerencie sua agenda e disponibilidade, aceitando coletas nos horários que funcionam para você.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 w-fit mb-4">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-green-800 mb-2">Suporte Dedicado</h3>
                  <p className="text-gray-600">
                    Conte com nossa equipe de suporte para ajudar em qualquer questão relacionada à plataforma.
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl font-bold text-green-800">Benefícios Exclusivos para Parceiros</h2>
              <p className="text-gray-600">
                Nossa plataforma foi desenvolvida pensando nas necessidades das empresas de coleta de lixo eletrônico,
                oferecendo ferramentas e recursos que facilitam a gestão do seu negócio.
              </p>
              <p className="text-gray-600">
                Além de conectar você a novos clientes, oferecemos um painel administrativo completo para gerenciar suas
                coletas, acompanhar seu desempenho e expandir sua operação.
              </p>
              <div className="pt-4">
                <Link href="#form-parceiro">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">Torne-se um Parceiro Agora</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials from Partners */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-4">O Que Nossos Parceiros Dizem</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Confira os depoimentos de empresas que já fazem parte da nossa rede de parceiros.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-green-100 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                    <span className="text-xl font-bold">E</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-800">Empresa Parceira</h4>
                    <p className="text-sm text-gray-500">São Paulo, SP</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  Desde que nos tornamos parceiros, aumentamos nosso volume de coletas em 40%. A plataforma é intuitiva
                  e nos conecta com clientes qualificados que realmente precisam dos nossos serviços.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                    <span className="text-xl font-bold">R</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-800">Empresa Parceira</h4>
                    <p className="text-sm text-gray-500">Rio de Janeiro, RJ</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  A parceria com a plataforma nos permitiu expandir nossa área de atuação e otimizar nossas rotas de
                  coleta. O sistema de agendamento é eficiente e o suporte é excelente.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                    <span className="text-xl font-bold">T</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-800">Empresa Parceira</h4>
                    <p className="text-sm text-gray-500">Belo Horizonte, MG</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  Como uma empresa de pequeno porte, a plataforma nos deu visibilidade e credibilidade no mercado.
                  Hoje, temos uma agenda cheia de coletas e estamos expandindo nossa equipe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partner Form */}
      <section id="form-parceiro" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-green-800 mb-4">Torne-se um Parceiro</h2>
              <p className="text-gray-600">
                Preencha o formulário abaixo para iniciar o processo de parceria. Nossa equipe entrará em contato para
                fornecer mais informações e finalizar seu cadastro.
              </p>
            </div>

            <Card className="border-green-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Cadastro de Empresa Parceira</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {success ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md mb-4">
                    <p className="font-medium">{success}</p>
                    <p className="text-sm mt-2">Redirecionando para o dashboard...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}

                    {/* CNPJ com busca automática */}
                    <div className="space-y-1">
                      <Label htmlFor="cnpj" className="text-sm font-medium text-gray-700">
                        CNPJ da Empresa*
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="cnpj"
                          value={cnpj}
                          onChange={(e) => setCnpj(formatarCNPJ(e.target.value))}
                          className="border-green-200 focus-visible:ring-green-500"
                          placeholder="00.000.000/0000-00"
                          required
                        />
                        <Button
                          type="button"
                          onClick={buscarDadosCNPJ}
                          disabled={isSearchingCnpj || !cnpj || limparCNPJ(cnpj).length !== 14}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isSearchingCnpj ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Search className="h-4 w-4" />
                          )}
                          <span className="ml-2">Buscar</span>
                        </Button>
                      </div>
                      {cnpjError && (
                        <p className="text-sm text-amber-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />
                          {cnpjError}
                        </p>
                      )}
                      {cnpjFound && (
                        <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                          <CheckCircle className="h-4 w-4" />
                          CNPJ encontrado! Os campos foram preenchidos automaticamente.
                        </p>
                      )}
                    </div>

                    <Separator className="my-4" />

                    {/* Dados da Empresa */}
                    <div>
                      <h3 className="text-lg font-medium text-green-800 mb-4">Dados da Empresa</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="razaoSocial" className="text-sm font-medium text-gray-700">
                            Razão Social*
                          </Label>
                          <Input
                            id="razaoSocial"
                            name="razaoSocial"
                            value={dadosEmpresa.razaoSocial}
                            onChange={handleInputChange}
                            className="border-green-200 focus-visible:ring-green-500"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Corporativo*
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={dadosEmpresa.email}
                            onChange={handleInputChange}
                            className="border-green-200 focus-visible:ring-green-500"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">
                            Telefone*
                          </Label>
                          <Input
                            id="telefone"
                            name="telefone"
                            value={dadosEmpresa.telefone}
                            onChange={handleInputChange}
                            className="border-green-200 focus-visible:ring-green-500"
                            placeholder="(00) 00000-0000"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Endereço */}
                    <div>
                      <h3 className="text-lg font-medium text-green-800 mb-4">Endereço</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="cep" className="text-sm font-medium text-gray-700">
                            CEP*
                          </Label>
                          <div className="flex gap-2 items-center">
                            <Input
                              id="cep"
                              name="cep"
                              value={dadosEmpresa.cep}
                              onChange={handleInputChange}
                              className="border-green-200 focus-visible:ring-green-500"
                              placeholder="00000-000"
                              required
                            />
                            {isSearchingCep && <Loader2 className="h-4 w-4 animate-spin ml-1" />}
                          </div>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <Label htmlFor="endereco" className="text-sm font-medium text-gray-700">
                            Endereço*
                          </Label>
                          <Input
                            id="endereco"
                            name="endereco"
                            value={dadosEmpresa.endereco}
                            onChange={handleInputChange}
                            className="border-green-200 focus-visible:ring-green-500"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="numero" className="text-sm font-medium text-gray-700">
                            Número*
                          </Label>
                          <Input
                            id="numero"
                            name="numero"
                            value={dadosEmpresa.numero}
                            onChange={handleInputChange}
                            className="border-green-200 focus-visible:ring-green-500"
                            required
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <Label htmlFor="complemento" className="text-sm font-medium text-gray-700">
                            Complemento
                          </Label>
                          <Input
                            id="complemento"
                            name="complemento"
                            value={dadosEmpresa.complemento}
                            onChange={handleInputChange}
                            className="border-green-200 focus-visible:ring-green-500"
                            placeholder="Sala, Andar, etc."
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="bairro" className="text-sm font-medium text-gray-700">
                            Bairro*
                          </Label>
                          <Input
                            id="bairro"
                            name="bairro"
                            value={dadosEmpresa.bairro}
                            onChange={handleInputChange}
                            className="border-green-200 focus-visible:ring-green-500"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="cidade" className="text-sm font-medium text-gray-700">
                            Cidade*
                          </Label>
                          <Input
                            id="cidade"
                            name="cidade"
                            value={dadosEmpresa.cidade}
                            onChange={handleInputChange}
                            className="border-green-200 focus-visible:ring-green-500"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
                            Estado*
                          </Label>
                          <Input
                            id="estado"
                            name="estado"
                            value={dadosEmpresa.estado}
                            onChange={handleInputChange}
                            className="border-green-200 focus-visible:ring-green-500"
                            maxLength={2}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-6"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          "Cadastrar Empresa"
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

