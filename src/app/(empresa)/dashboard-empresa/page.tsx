"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  MapPin,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  User,
  X,
  ThumbsUp,
  ThumbsDown,
  CalendarClock,
  HourglassIcon,
} from "lucide-react"
import {
  buscarColetasEmpresa,
  atualizarStatusColeta,
  aceitarColeta,
  recusarColeta,
  solicitarAlteracaoDataHora,
  verificarSolicitacaoAlteracaoPendente,
} from "./actions"
import Navbar from "@/components/navbar"

// Interfaces para os dados
interface Endereco {
  id: string
  endereco_usu: string
  num_end: string
  bairro_end: string
  cidade_end: string
  estado_end: string
  complemento_end?: string | null
  cep_end: string
}

interface Item {
  id: string
  itens: string
  quantidade: number
  observacao?: string | null
}

interface Usuario {
  id: string
  name: string
  email: string
  tel_usu?: string | null
}

interface Coleta {
  id: string
  status_coleta: string
  data_coleta: string | Date
  id_empresa: string | null
  endereco?: Endereco
  itens: Item[]
  usuario: Usuario
  temSolicitacaoPendente?: boolean
  dataHoraProposta?: string | null
}

export default function DashboardEmpresa() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  // Estados para os dados e UI
  const [coletas, setColetas] = useState<Coleta[]>([])
  const [coletasFiltradas, setColetasFiltradas] = useState<Coleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtroStatus, setFiltroStatus] = useState<string>("todas")
  const [termoBusca, setTermoBusca] = useState("")
  const [coletaSelecionada, setColetaSelecionada] = useState<Coleta | null>(null)
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false)
  const [atualizandoStatus, setAtualizandoStatus] = useState(false)
  const [coletasRecusadas, setColetasRecusadas] = useState<Set<string>>(new Set())

  // Estados para o modal de alteração de data/hora
  const [modalAlterarDataHoraAberto, setModalAlterarDataHoraAberto] = useState(false)
  const [novaData, setNovaData] = useState("")
  const [novaHora, setNovaHora] = useState("")
  const [enviandoAlteracao, setEnviandoAlteracao] = useState(false)
  const [mensagemAlteracao, setMensagemAlteracao] = useState<string | null>(null)

  // Verificar se o usuário está logado
  useEffect(() => {
    if (session === null && !isPending) {
      router.push("/login")
    }
  }, [session, isPending, router])

  // Carregar coletas da empresa
  useEffect(() => {
    if (session?.user?.id) {
      carregarColetas()
    }
  }, [session])

  // Função para filtrar coletas - transformada em useCallback para evitar dependência cíclica
  const filtrarColetas = useCallback(() => {
    let coletasFiltradas = [...coletas]

    // Remover coletas recusadas da lista
    coletasFiltradas = coletasFiltradas.filter((coleta) => !coletasRecusadas.has(coleta.id))

    // Filtrar por status
    if (filtroStatus !== "todas") {
      coletasFiltradas = coletasFiltradas.filter(
        (coleta) => coleta.status_coleta.toLowerCase() === filtroStatus.toLowerCase(),
      )
    }

    // Filtrar por termo de busca
    if (termoBusca.trim()) {
      const termo = termoBusca.toLowerCase()
      coletasFiltradas = coletasFiltradas.filter(
        (coleta) =>
          coleta.id.toLowerCase().includes(termo) ||
          coleta.usuario.name.toLowerCase().includes(termo) ||
          coleta.endereco?.cidade_end.toLowerCase().includes(termo) ||
          false ||
          coleta.endereco?.bairro_end.toLowerCase().includes(termo) ||
          false,
      )
    }

    setColetasFiltradas(coletasFiltradas)
  }, [coletas, coletasRecusadas, filtroStatus, termoBusca])

  // Filtrar coletas quando o filtro ou termo de busca mudar
  useEffect(() => {
    filtrarColetas()
  }, [filtrarColetas])

  // Função para carregar coletas
  const carregarColetas = async () => {
    try {
      setLoading(true)
      const dados = await buscarColetasEmpresa()

      // Converter datas para objetos Date e verificar solicitações pendentes
      const coletasFormatadas = await Promise.all(
        dados.map(async (coleta) => {
          // Verificar se existe uma solicitação de alteração pendente
          const solicitacaoPendente = await verificarSolicitacaoAlteracaoPendente(coleta.id)

          return {
            ...coleta,
            data_coleta: new Date(coleta.data_coleta),
            temSolicitacaoPendente: solicitacaoPendente.temSolicitacao,
            dataHoraProposta: solicitacaoPendente.dataHoraProposta
              ? String(solicitacaoPendente.dataHoraProposta)
              : null,
          }
        }),
      )

      setColetas(coletasFormatadas)
      setError(null)
    } catch (err: unknown) {
      console.error("Erro ao carregar coletas:", err)
      setError(err instanceof Error ? err.message : "Não foi possível carregar as coletas. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  // Função para abrir modal de detalhes
  const abrirDetalhes = async (coleta: Coleta) => {
    // Verificar se existe uma solicitação de alteração pendente
    try {
      const solicitacaoPendente = await verificarSolicitacaoAlteracaoPendente(coleta.id)

      // Atualizar a coleta com a informação de solicitação pendente
      const coletaAtualizada = {
        ...coleta,
        temSolicitacaoPendente: solicitacaoPendente.temSolicitacao,
        dataHoraProposta: solicitacaoPendente.dataHoraProposta ? String(solicitacaoPendente.dataHoraProposta) : null,
      }

      setColetaSelecionada(coletaAtualizada)
      setModalDetalhesAberto(true)
      // Impedir scroll da página quando o modal está aberto
      document.body.style.overflow = "hidden"
    } catch (err) {
      console.error("Erro ao verificar solicitação pendente:", err)
      // Em caso de erro, abrir o modal com os dados que temos
      setColetaSelecionada(coleta)
      setModalDetalhesAberto(true)
      document.body.style.overflow = "hidden"
    }
  }

  // Função para fechar modal de detalhes
  const fecharDetalhes = () => {
    setModalDetalhesAberto(false)
    document.body.style.overflow = "auto"
  }

  // Função para abrir modal de alteração de data/hora
  const abrirModalAlterarDataHora = () => {
    if (coletaSelecionada) {
      const dataAtual = new Date(coletaSelecionada.data_coleta)
      setNovaData(dataAtual.toISOString().split("T")[0])
      setNovaHora(`${String(dataAtual.getHours()).padStart(2, "0")}:${String(dataAtual.getMinutes()).padStart(2, "0")}`)
      setMensagemAlteracao(null)
      setModalAlterarDataHoraAberto(true)
    }
  }

  // Função para fechar modal de alteração de data/hora
  const fecharModalAlterarDataHora = () => {
    setModalAlterarDataHoraAberto(false)
    setMensagemAlteracao(null)
  }

  // Função para enviar solicitação de alteração de data/hora
  const enviarSolicitacaoAlteracaoDataHora = async () => {
    if (!coletaSelecionada || !novaData || !novaHora) return

    try {
      setEnviandoAlteracao(true)

      // Criar objeto de data a partir dos inputs
      const [ano, mes, dia] = novaData.split("-").map(Number)
      const [hora, minuto] = novaHora.split(":").map(Number)
      const novaDataHora = new Date(ano, mes - 1, dia, hora, minuto)

      await solicitarAlteracaoDataHora(coletaSelecionada.id, novaDataHora.toISOString())

      setMensagemAlteracao("Solicitação de alteração enviada com sucesso! Aguardando confirmação do cliente.")

      // Atualizar a coleta selecionada com a nova data pendente
      if (coletaSelecionada) {
        setColetaSelecionada({
          ...coletaSelecionada,
          temSolicitacaoPendente: true,
          dataHoraProposta: novaDataHora.toISOString(),
        })
      }

      // Atualizar a lista de coletas
      await carregarColetas()

      // Fechar o modal após alguns segundos
      setTimeout(() => {
        fecharModalAlterarDataHora()
      }, 3000)
    } catch (err: unknown) {
      console.error("Erro ao solicitar alteração de data/hora:", err)
      setMensagemAlteracao(err instanceof Error ? err.message : "Erro ao solicitar alteração de data/hora")
    } finally {
      setEnviandoAlteracao(false)
    }
  }

  // Função para aceitar uma coleta
  const handleAceitarColeta = async (coletaId: string) => {
    try {
      setAtualizandoStatus(true)
      await aceitarColeta(coletaId)

      // Atualizar o estado local
      const coletasAtualizadas = coletas.map((coleta) => {
        if (coleta.id === coletaId) {
          return {
            ...coleta,
            status_coleta: "Confirmado",
            id_empresa: session?.user?.id || null,
          }
        }
        return coleta
      })

      setColetas(coletasAtualizadas)

      if (coletaSelecionada && coletaSelecionada.id === coletaId) {
        setColetaSelecionada({
          ...coletaSelecionada,
          status_coleta: "Confirmado",
          id_empresa: session?.user?.id || null,
        })
      }

      // Fechar o modal se estiver aberto
      if (modalDetalhesAberto) {
        fecharDetalhes()
      }
    } catch (err: unknown) {
      console.error("Erro ao aceitar coleta:", err)
      setError(err instanceof Error ? err.message : "Erro ao aceitar coleta")
    } finally {
      setAtualizandoStatus(false)
    }
  }

  // Função para recusar uma coleta
  const handleRecusarColeta = async (coletaId: string) => {
    try {
      if (!session?.session.activeOrganizationId) return
      setAtualizandoStatus(true)
      await recusarColeta(coletaId, session?.session.activeOrganizationId)

      // Adicionar à lista de coletas recusadas
      setColetasRecusadas((prev) => new Set(prev).add(coletaId))

      // Fechar o modal se estiver aberto
      if (modalDetalhesAberto && coletaSelecionada?.id === coletaId) {
        fecharDetalhes()
      }
    } catch (err: unknown) {
      console.error("Erro ao recusar coleta:", err)
      setError(err instanceof Error ? err.message : "Erro ao recusar coleta")
    } finally {
      setAtualizandoStatus(false)
    }
  }

  // Função para atualizar status da coleta
  const handleAtualizarStatusColeta = async (coletaId: string, novoStatus: string) => {
    try {
      setAtualizandoStatus(true)
      await atualizarStatusColeta(coletaId, novoStatus)

      // Atualizar o estado local
      const coletasAtualizadas = coletas.map((coleta) => {
        if (coleta.id === coletaId) {
          return { ...coleta, status_coleta: novoStatus }
        }
        return coleta
      })

      setColetas(coletasAtualizadas)

      if (coletaSelecionada && coletaSelecionada.id === coletaId) {
        setColetaSelecionada({ ...coletaSelecionada, status_coleta: novoStatus })
      }
    } catch (err: unknown) {
      console.error("Erro ao atualizar status:", err)
      setError(err instanceof Error ? err.message : "Erro ao atualizar status da coleta")
    } finally {
      setAtualizandoStatus(false)
    }
  }

  // Função para formatar data
  const formatarData = (dataString: string | Date) => {
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Função para formatar hora
  const formatarHora = (dataString: string | Date) => {
    const data = new Date(dataString)
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Função para verificar se uma coleta está disponível para aceitação
  const isColetaDisponivel = (coleta: Coleta) => {
    return coleta.status_coleta === "Solicitado" && coleta.id_empresa === null
  }

  // Função para verificar se uma coleta pertence à empresa
  const isColetaDaEmpresa = (coleta: Coleta) => {
    return coleta.id_empresa !== null
  }

  // Função para obter cor do status
  const getCorStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "solicitado":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "confirmado":
        return "bg-green-100 text-green-800 border-green-200"
      case "em andamento":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "concluído":
        return "bg-green-500 text-white"
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Função para obter ícone do status
  const getIconeStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "solicitado":
        return <Clock className="h-4 w-4" />
      case "confirmado":
        return <CheckCircle className="h-4 w-4" />
      case "em andamento":
        return <Truck className="h-4 w-4" />
      case "concluído":
        return <CheckCircle className="h-4 w-4" />
      case "cancelado":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Função para contar coletas por status
  const contarColetasPorStatus = (status: string) => {
    // Filtrar coletas recusadas
    const coletasValidas = coletas.filter((coleta) => !coletasRecusadas.has(coleta.id))

    return coletasValidas.filter(
      (coleta) => status === "todas" || coleta.status_coleta.toLowerCase() === status.toLowerCase(),
    ).length
  }

  // Função para contar coletas disponíveis
  const contarColetasDisponiveis = () => {
    // Filtrar coletas recusadas
    const coletasValidas = coletas.filter((coleta) => !coletasRecusadas.has(coleta.id))

    return coletasValidas.filter((coleta) => coleta.status_coleta === "Solicitado" && coleta.id_empresa === null).length
  }

  // Renderização de estado de carregamento
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4">
          <div className="container mx-auto py-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
            <p className="text-center mt-4 text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-green-800">Gerenciar Coletas</h1>
              <p className="text-green-600 mt-1">Gerencie as solicitações de coleta de lixo eletrônico</p>
            </div>
            <Button
              onClick={carregarColetas}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar Dados
            </Button>
          </div>

          {error ? (
            <Card className="border-red-200 mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
                <Button onClick={carregarColetas} className="mt-4 bg-red-600 hover:bg-red-700 text-white">
                  Tentar Novamente
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Cards de resumo */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <Card className="border-blue-100">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Disponíveis</p>
                        <p className="text-3xl font-bold">{contarColetasDisponiveis()}</p>
                      </div>
                      <div className="p-3 rounded-full bg-blue-100">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-100">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-green-600">Confirmadas</p>
                        <p className="text-3xl font-bold">{contarColetasPorStatus("confirmado")}</p>
                      </div>
                      <div className="p-3 rounded-full bg-green-100">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-yellow-100">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-yellow-600">Em Andamento</p>
                        <p className="text-3xl font-bold">{contarColetasPorStatus("em andamento")}</p>
                      </div>
                      <div className="p-3 rounded-full bg-yellow-100">
                        <Truck className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-100">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-green-600">Concluídas</p>
                        <p className="text-3xl font-bold">{contarColetasPorStatus("concluído")}</p>
                      </div>
                      <div className="p-3 rounded-full bg-green-100">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-100">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total</p>
                        <p className="text-3xl font-bold">{contarColetasPorStatus("todas")}</p>
                      </div>
                      <div className="p-3 rounded-full bg-gray-100">
                        <Package className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filtros e busca */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por ID, cliente ou localização..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-gray-200 flex items-center gap-2"
                    onClick={() => setFiltroStatus("todas")}
                  >
                    <Filter className="h-4 w-4" />
                    Filtrar
                  </Button>
                  <select
                    className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                  >
                    <option value="todas">Todas</option>
                    <option value="solicitado">Disponíveis</option>
                    <option value="confirmado">Confirmadas</option>
                    <option value="em andamento">Em Andamento</option>
                    <option value="concluído">Concluídas</option>
                    <option value="cancelado">Canceladas</option>
                  </select>
                </div>
              </div>

              {/* Tabs de status */}
              <Tabs defaultValue="todas" className="mb-8">
                <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
                  <TabsTrigger value="todas" onClick={() => setFiltroStatus("todas")}>
                    Todas
                  </TabsTrigger>
                  <TabsTrigger value="solicitado" onClick={() => setFiltroStatus("solicitado")}>
                    Disponíveis
                  </TabsTrigger>
                  <TabsTrigger value="confirmado" onClick={() => setFiltroStatus("confirmado")}>
                    Confirmadas
                  </TabsTrigger>
                  <TabsTrigger value="em andamento" onClick={() => setFiltroStatus("em andamento")}>
                    Em Andamento
                  </TabsTrigger>
                  <TabsTrigger value="concluído" onClick={() => setFiltroStatus("concluído")}>
                    Concluídas
                  </TabsTrigger>
                  <TabsTrigger value="cancelado" onClick={() => setFiltroStatus("cancelado")}>
                    Canceladas
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="todas" className="mt-0">
                  <ListaColetas
                    coletas={coletasFiltradas}
                    abrirDetalhes={abrirDetalhes}
                    formatarData={formatarData}
                    formatarHora={formatarHora}
                    getCorStatus={getCorStatus}
                    getIconeStatus={getIconeStatus}
                    isColetaDisponivel={isColetaDisponivel}
                    isColetaDaEmpresa={isColetaDaEmpresa}
                    onAceitar={handleAceitarColeta}
                    onRecusar={handleRecusarColeta}
                    onAtualizarStatusColeta={handleAtualizarStatusColeta}
                    atualizandoStatus={atualizandoStatus}
                  />
                </TabsContent>

                <TabsContent value="solicitado" className="mt-0">
                  <ListaColetas
                    coletas={coletasFiltradas}
                    abrirDetalhes={abrirDetalhes}
                    formatarData={formatarData}
                    formatarHora={formatarHora}
                    getCorStatus={getCorStatus}
                    getIconeStatus={getIconeStatus}
                    isColetaDisponivel={isColetaDisponivel}
                    isColetaDaEmpresa={isColetaDaEmpresa}
                    onAceitar={handleAceitarColeta}
                    onRecusar={handleRecusarColeta}
                    onAtualizarStatusColeta={handleAtualizarStatusColeta}
                    atualizandoStatus={atualizandoStatus}
                  />
                </TabsContent>

                <TabsContent value="confirmado" className="mt-0">
                  <ListaColetas
                    coletas={coletasFiltradas}
                    abrirDetalhes={abrirDetalhes}
                    formatarData={formatarData}
                    formatarHora={formatarHora}
                    getCorStatus={getCorStatus}
                    getIconeStatus={getIconeStatus}
                    isColetaDisponivel={isColetaDisponivel}
                    isColetaDaEmpresa={isColetaDaEmpresa}
                    onAceitar={handleAceitarColeta}
                    onRecusar={handleRecusarColeta}
                    onAtualizarStatusColeta={handleAtualizarStatusColeta}
                    atualizandoStatus={atualizandoStatus}
                  />
                </TabsContent>

                <TabsContent value="em andamento" className="mt-0">
                  <ListaColetas
                    coletas={coletasFiltradas}
                    abrirDetalhes={abrirDetalhes}
                    formatarData={formatarData}
                    formatarHora={formatarHora}
                    getCorStatus={getCorStatus}
                    getIconeStatus={getIconeStatus}
                    isColetaDisponivel={isColetaDisponivel}
                    isColetaDaEmpresa={isColetaDaEmpresa}
                    onAceitar={handleAceitarColeta}
                    onRecusar={handleRecusarColeta}
                    onAtualizarStatusColeta={handleAtualizarStatusColeta}
                    atualizandoStatus={atualizandoStatus}
                  />
                </TabsContent>

                <TabsContent value="concluído" className="mt-0">
                  <ListaColetas
                    coletas={coletasFiltradas}
                    abrirDetalhes={abrirDetalhes}
                    formatarData={formatarData}
                    formatarHora={formatarHora}
                    getCorStatus={getCorStatus}
                    getIconeStatus={getIconeStatus}
                    isColetaDisponivel={isColetaDisponivel}
                    isColetaDaEmpresa={isColetaDaEmpresa}
                    onAceitar={handleAceitarColeta}
                    onRecusar={handleRecusarColeta}
                    onAtualizarStatusColeta={handleAtualizarStatusColeta}
                    atualizandoStatus={atualizandoStatus}
                  />
                </TabsContent>

                <TabsContent value="cancelado" className="mt-0">
                  <ListaColetas
                    coletas={coletasFiltradas}
                    abrirDetalhes={abrirDetalhes}
                    formatarData={formatarData}
                    formatarHora={formatarHora}
                    getCorStatus={getCorStatus}
                    getIconeStatus={getIconeStatus}
                    isColetaDisponivel={isColetaDisponivel}
                    isColetaDaEmpresa={isColetaDaEmpresa}
                    onAceitar={handleAceitarColeta}
                    onRecusar={handleRecusarColeta}
                    onAtualizarStatusColeta={handleAtualizarStatusColeta}
                    atualizandoStatus={atualizandoStatus}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {modalDetalhesAberto && coletaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Coleta #{coletaSelecionada.id.substring(0, 8)}</h2>
                    <p className="text-sm text-gray-500">Detalhes completos da solicitação</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCorStatus(coletaSelecionada.status_coleta)}`}
                  >
                    {getIconeStatus(coletaSelecionada.status_coleta)}
                    <span className="ml-1">{coletaSelecionada.status_coleta}</span>
                  </span>
                  <button onClick={fecharDetalhes} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Informações da Coleta */}
                <Card className="border-green-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      Informações da Coleta
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data:</span>
                        <span className="font-medium">{formatarData(coletaSelecionada.data_coleta)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Horário:</span>
                        <span className="font-medium">{formatarHora(coletaSelecionada.data_coleta)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCorStatus(coletaSelecionada.status_coleta)}`}
                        >
                          {coletaSelecionada.status_coleta}
                        </span>
                      </div>

                      {/* Mostrar informação sobre solicitação de alteração pendente */}
                      {coletaSelecionada.temSolicitacaoPendente && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                          <div className="flex items-center gap-2 text-amber-700 mb-1">
                            <HourglassIcon className="h-4 w-4" />
                            <span className="font-medium">Alteração de data/hora solicitada</span>
                          </div>
                          <p className="text-sm text-amber-600">
                            Nova data/hora proposta: {formatarData(coletaSelecionada.dataHoraProposta || "")} às{" "}
                            {formatarHora(coletaSelecionada.dataHoraProposta || "")}
                          </p>
                          <p className="text-sm text-amber-600 mt-1">Aguardando confirmação do cliente.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Informações do Cliente */}
                <Card className="border-green-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-green-600" />
                      Informações do Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nome:</span>
                        <span className="font-medium">{coletaSelecionada.usuario.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{coletaSelecionada.usuario.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Telefone:</span>
                        <span className="font-medium">{coletaSelecionada.usuario.tel_usu || "Não informado"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Endereço */}
              {coletaSelecionada.endereco && (
                <Card className="border-green-100 mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Endereço de Coleta
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-800">
                      {coletaSelecionada.endereco.endereco_usu}, {coletaSelecionada.endereco.num_end}
                      {coletaSelecionada.endereco.complemento_end
                        ? `, ${coletaSelecionada.endereco.complemento_end}`
                        : ""}
                    </p>
                    <p className="text-gray-600">
                      {coletaSelecionada.endereco.bairro_end}, {coletaSelecionada.endereco.cidade_end} -{" "}
                      {coletaSelecionada.endereco.estado_end}
                    </p>
                    <p className="text-gray-600">CEP: {coletaSelecionada.endereco.cep_end}</p>
                  </CardContent>
                </Card>
              )}

              {/* Itens para Coleta */}
              <Card className="border-green-100 mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    Itens para Coleta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y divide-gray-100">
                    {coletaSelecionada.itens.map((item) => (
                      <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex justify-between">
                          <span className="text-gray-800">{item.itens}</span>
                          <span className="font-medium">
                            {item.quantidade} unidade{item.quantidade > 1 ? "s" : ""}
                          </span>
                        </div>
                        {item.observacao && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Observação:</span> {item.observacao}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Ações */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {/* Botão para trocar data ou horário - só aparece se não houver solicitação pendente */}
                  {isColetaDaEmpresa(coletaSelecionada) &&
                    (coletaSelecionada.status_coleta === "Confirmado" ||
                      coletaSelecionada.status_coleta === "Solicitado") &&
                    !coletaSelecionada.temSolicitacaoPendente && (
                      <Button
                        onClick={abrirModalAlterarDataHora}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                      >
                        <CalendarClock className="h-4 w-4" />
                        Trocar data ou horário
                      </Button>
                    )}

                  {/* Botões para coletas disponíveis */}
                  {isColetaDisponivel(coletaSelecionada) && (
                    <>
                      <Button
                        onClick={() => handleAceitarColeta(coletaSelecionada.id)}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                        disabled={atualizandoStatus}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Aceitar Coleta
                      </Button>
                      <Button
                        onClick={() => handleRecusarColeta(coletaSelecionada.id)}
                        className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                        disabled={atualizandoStatus}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        Recusar Coleta
                      </Button>
                    </>
                  )}

                  {/* Botões para coletas da empresa */}
                  {isColetaDaEmpresa(coletaSelecionada) && (
                    <>
                      {coletaSelecionada.status_coleta === "Confirmado" && (
                        <Button
                          onClick={() => handleAtualizarStatusColeta(coletaSelecionada.id, "Em andamento")}
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                          disabled={atualizandoStatus}
                        >
                          <Truck className="h-4 w-4 mr-1" />
                          Iniciar Coleta
                        </Button>
                      )}

                      {coletaSelecionada.status_coleta === "Em andamento" && (
                        <Button
                          onClick={() => handleAtualizarStatusColeta(coletaSelecionada.id, "Concluído")}
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                          disabled={atualizandoStatus}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Finalizar Coleta
                        </Button>
                      )}

                      {coletaSelecionada.status_coleta !== "Cancelado" &&
                        coletaSelecionada.status_coleta !== "Concluído" && (
                          <Button
                            onClick={() => handleAtualizarStatusColeta(coletaSelecionada.id, "Cancelado")}
                            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                            disabled={atualizandoStatus}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancelar Coleta
                          </Button>
                        )}
                    </>
                  )}

                  {atualizandoStatus && (
                    <span className="text-sm text-gray-600 flex items-center">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Atualizando...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Alterar Data/Hora */}
      {modalAlterarDataHoraAberto && coletaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <CalendarClock className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Alterar Data/Hora</h2>
                    <p className="text-sm text-gray-500">Coleta #{coletaSelecionada.id.substring(0, 8)}</p>
                  </div>
                </div>
                <button
                  onClick={fecharModalAlterarDataHora}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Aviso */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Atenção:</strong> O cliente precisará aceitar a nova data e horário propostos. Ele será
                  notificado sobre esta alteração e poderá aceitar ou recusar.
                </p>
              </div>

              {/* Formulário */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="nova-data" className="block text-sm font-medium text-gray-700 mb-1">
                    Nova Data
                  </label>
                  <input
                    type="date"
                    id="nova-data"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={novaData}
                    onChange={(e) => setNovaData(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="nova-hora" className="block text-sm font-medium text-gray-700 mb-1">
                    Novo Horário
                  </label>
                  <input
                    type="time"
                    id="nova-hora"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={novaHora}
                    onChange={(e) => setNovaHora(e.target.value)}
                  />
                </div>

                {mensagemAlteracao && (
                  <div
                    className={`p-3 rounded-md ${mensagemAlteracao.includes("sucesso") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                  >
                    {mensagemAlteracao}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={fecharModalAlterarDataHora}
                    className="border-gray-300"
                    disabled={enviandoAlteracao}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={enviarSolicitacaoAlteracaoDataHora}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={enviandoAlteracao || !novaData || !novaHora}
                  >
                    {enviandoAlteracao ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      "Solicitar Alteração"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Componente para listar coletas
function ListaColetas({
  coletas,
  abrirDetalhes,
  formatarData,
  formatarHora,
  getCorStatus,
  getIconeStatus,
  isColetaDisponivel,
  isColetaDaEmpresa,
  onAceitar,
  onRecusar,
  onAtualizarStatusColeta,
  atualizandoStatus,
}: {
  coletas: Coleta[]
  abrirDetalhes: (coleta: Coleta) => void
  formatarData: (data: string | Date) => string
  formatarHora: (data: string | Date) => string
  getCorStatus: (status: string) => string
  getIconeStatus: (status: string) => React.ReactNode
  isColetaDisponivel: (coleta: Coleta) => boolean
  isColetaDaEmpresa: (coleta: Coleta) => boolean
  onAceitar: (id: string) => void
  onRecusar: (id: string) => void
  onAtualizarStatusColeta: (id: string, status: string) => void
  atualizandoStatus: boolean
}) {
  if (coletas.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhuma coleta encontrada</h3>
        <p className="text-gray-600">Não há coletas disponíveis com os filtros selecionados.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {coletas.map((coleta) => (
        <div
          key={coleta.id}
          className="bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all overflow-hidden"
        >
          <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Coleta #{coleta.id.substring(0, 8)}</h3>
                  <p className="text-sm text-gray-500">
                    {formatarData(coleta.data_coleta)} às {formatarHora(coleta.data_coleta)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium gap-1 ${getCorStatus(coleta.status_coleta)}`}
                >
                  {getIconeStatus(coleta.status_coleta)}
                  <span>{coleta.status_coleta}</span>
                </span>

                {/* Indicador de coleta disponível */}
                {isColetaDisponivel(coleta) && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">Disponível</span>
                )}

                {/* Indicador de alteração pendente */}
                {coleta.temSolicitacaoPendente && (
                  <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                    <HourglassIcon className="h-3 w-3" />
                    <span>Alteração pendente</span>
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Cliente</p>
                  <p className="text-sm text-gray-600">{coleta.usuario.name}</p>
                </div>
              </div>

              {coleta.endereco && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Endereço</p>
                    <p className="text-sm text-gray-600 truncate">
                      {coleta.endereco.bairro_end}, {coleta.endereco.cidade_end} - {coleta.endereco.estado_end}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2">
                <Package className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Itens</p>
                  <p className="text-sm text-gray-600 truncate">
                    {coleta.itens.map((item) => `${item.quantidade} ${item.itens}`).join(", ")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-between mt-4">
              {/* Botão Ver Detalhes à esquerda */}
              <Button
                onClick={() => abrirDetalhes(coleta)}
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                Ver Detalhes
              </Button>

              {/* Botões de ação à direita */}
              <div className="flex flex-wrap gap-2">
                {/* Botões de ação para coletas disponíveis */}
                {isColetaDisponivel(coleta) && (
                  <>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        onAceitar(coleta.id)
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={atualizandoStatus}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Aceitar
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRecusar(coleta.id)
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={atualizandoStatus}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      Recusar
                    </Button>
                  </>
                )}

                {/* Botões de ação para coletas da empresa */}
                {isColetaDaEmpresa(coleta) && (
                  <>
                    {coleta.status_coleta === "Confirmado" && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          onAtualizarStatusColeta(coleta.id, "Em andamento")
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={atualizandoStatus}
                      >
                        <Truck className="h-4 w-4 mr-1" />
                        Iniciar Coleta
                      </Button>
                    )}

                    {coleta.status_coleta === "Em andamento" && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          onAtualizarStatusColeta(coleta.id, "Concluído")
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={atualizandoStatus}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Finalizar Coleta
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
