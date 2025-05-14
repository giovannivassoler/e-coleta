"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Users,
  Building2,
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  RefreshCw,
  Check,
  Clock,
  XCircle,
  Filter,
  X,
  AlertCircle,
  Calendar,
} from "lucide-react"
import Navbar from "@/components/navbar"

// Interfaces para os dados
interface Endereco {
  cidade_end: string
  estado_end: string
}

interface Cliente {
  id: string
  name: string
  email: string
  tel_usu?: string | null
  created_at: Date
  endereco?: Endereco
  totalColetas: number
}

interface Empresa {
  id: string
  name: string
  email: string | null
  tel_empresa?: string | null
  created_at: Date
  endereco?: Endereco
  totalColetas: number
  status: string
}

export default function AdminPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  // Estados para dados
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([])
  const [empresasFiltradas, setEmpresasFiltradas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados para filtros e buscas
  const [termoBuscaClientes, setTermoBuscaClientes] = useState("")
  const [termoBuscaEmpresas, setTermoBuscaEmpresas] = useState("")
  const [filtroEstadoClientes, setFiltroEstadoClientes] = useState("todos")
  const [filtroEstadoEmpresas, setFiltroEstadoEmpresas] = useState("todos")
  const [filtroStatusEmpresas, setFiltroStatusEmpresas] = useState("todos")

  // Estados para paginação
  const [paginaAtualClientes, setPaginaAtualClientes] = useState(1)
  const [paginaAtualEmpresas, setPaginaAtualEmpresas] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(10)

  // Estados para modais
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(null)
  const [modalClienteAberto, setModalClienteAberto] = useState(false)
  const [modalEmpresaAberto, setModalEmpresaAberto] = useState(false)

  // Verificar autenticação básica
  useEffect(() => {
    if (session === null && !isPending) {
      router.push("/login")
    }
  }, [session, isPending, router])

  // Carregar dados iniciais (simulados por enquanto)
  useEffect(() => {
    if (session) {
      carregarDadosSimulados()
    }
  }, [session])

  // Função para carregar dados simulados
  const carregarDadosSimulados = () => {
    try {
      setLoading(true)

      // Dados simulados de clientes
      const clientesSimulados: Cliente[] = [
        {
          id: "1",
          name: "João Silva",
          email: "joao@example.com",
          tel_usu: "(11) 98765-4321",
          created_at: new Date("2023-01-15"),
          endereco: { cidade_end: "São Paulo", estado_end: "SP" },
          totalColetas: 5,
        },
        {
          id: "2",
          name: "Maria Oliveira",
          email: "maria@example.com",
          tel_usu: "(21) 98765-4321",
          created_at: new Date("2023-02-20"),
          endereco: { cidade_end: "Rio de Janeiro", estado_end: "RJ" },
          totalColetas: 3,
        },
        {
          id: "3",
          name: "Carlos Santos",
          email: "carlos@example.com",
          tel_usu: "(31) 98765-4321",
          created_at: new Date("2023-03-10"),
          endereco: { cidade_end: "Belo Horizonte", estado_end: "MG" },
          totalColetas: 2,
        },
      ]

      // Dados simulados de empresas
      const empresasSimuladas: Empresa[] = [
        {
          id: "1",
          name: "EcoTech Reciclagem",
          email: "contato@ecotech.com",
          tel_empresa: "(11) 3333-4444",
          created_at: new Date("2022-10-05"),
          endereco: { cidade_end: "São Paulo", estado_end: "SP" },
          totalColetas: 15,
          status: "Ativo",
        },
        {
          id: "2",
          name: "Recicla Mais",
          email: "contato@reciclamais.com",
          tel_empresa: "(21) 3333-4444",
          created_at: new Date("2022-11-15"),
          endereco: { cidade_end: "Rio de Janeiro", estado_end: "RJ" },
          totalColetas: 8,
          status: "Ativo",
        },
        {
          id: "3",
          name: "Verde Coleta",
          email: "contato@verdecoleta.com",
          tel_empresa: "(31) 3333-4444",
          created_at: new Date("2022-12-20"),
          endereco: { cidade_end: "Belo Horizonte", estado_end: "MG" },
          totalColetas: 0,
          status: "Pendente",
        },
      ]

      setClientes(clientesSimulados)
      setEmpresas(empresasSimuladas)
      setClientesFiltrados(clientesSimulados)
      setEmpresasFiltradas(empresasSimuladas)
      setError(null)
    } catch (err) {
      console.error("Erro ao carregar dados:", err)
      setError("Erro ao carregar dados. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  // Função para filtrar clientes
  const filtrarClientes = () => {
    let resultado = [...clientes]

    // Filtrar por termo de busca
    if (termoBuscaClientes.trim()) {
      const termo = termoBuscaClientes.toLowerCase()
      resultado = resultado.filter(
        (cliente) =>
          cliente.name.toLowerCase().includes(termo) ||
          cliente.email.toLowerCase().includes(termo) ||
          (cliente.tel_usu && cliente.tel_usu.includes(termo)),
      )
    }

    // Filtrar por estado
    if (filtroEstadoClientes !== "todos") {
      resultado = resultado.filter((cliente) => cliente.endereco?.estado_end === filtroEstadoClientes)
    }

    setClientesFiltrados(resultado)
    setPaginaAtualClientes(1)
  }

  // Função para filtrar empresas
  const filtrarEmpresas = () => {
    let resultado = [...empresas]

    // Filtrar por termo de busca
    if (termoBuscaEmpresas.trim()) {
      const termo = termoBuscaEmpresas.toLowerCase()
      resultado = resultado.filter(
        (empresa) =>
          empresa.name.toLowerCase().includes(termo) ||
          (empresa.email && empresa.email.toLowerCase().includes(termo)) ||
          (empresa.tel_empresa && empresa.tel_empresa.includes(termo)),
      )
    }

    // Filtrar por estado
    if (filtroEstadoEmpresas !== "todos") {
      resultado = resultado.filter((empresa) => empresa.endereco?.estado_end === filtroEstadoEmpresas)
    }

    // Filtrar por status
    if (filtroStatusEmpresas !== "todos") {
      resultado = resultado.filter((empresa) => empresa.status.toLowerCase() === filtroStatusEmpresas.toLowerCase())
    }

    setEmpresasFiltradas(resultado)
    setPaginaAtualEmpresas(1)
  }

  // Aplicar filtros quando os critérios mudarem
  useEffect(() => {
    filtrarClientes()
  }, [termoBuscaClientes, filtroEstadoClientes])

  useEffect(() => {
    filtrarEmpresas()
  }, [termoBuscaEmpresas, filtroEstadoEmpresas, filtroStatusEmpresas])

  // Funções para paginação
  const indexUltimoCliente = paginaAtualClientes * itensPorPagina
  const indexPrimeiroCliente = indexUltimoCliente - itensPorPagina
  const clientesPaginaAtual = clientesFiltrados.slice(indexPrimeiroCliente, indexUltimoCliente)
  const totalPaginasClientes = Math.ceil(clientesFiltrados.length / itensPorPagina)

  const indexUltimaEmpresa = paginaAtualEmpresas * itensPorPagina
  const indexPrimeiraEmpresa = indexUltimaEmpresa - itensPorPagina
  const empresasPaginaAtual = empresasFiltradas.slice(indexPrimeiraEmpresa, indexUltimaEmpresa)
  const totalPaginasEmpresas = Math.ceil(empresasFiltradas.length / itensPorPagina)

  // Funções para modais
  const abrirModalCliente = (cliente: Cliente) => {
    setClienteSelecionado(cliente)
    setModalClienteAberto(true)
    document.body.style.overflow = "hidden"
  }

  const fecharModalCliente = () => {
    setModalClienteAberto(false)
    document.body.style.overflow = "auto"
  }

  const abrirModalEmpresa = (empresa: Empresa) => {
    setEmpresaSelecionada(empresa)
    setModalEmpresaAberto(true)
    document.body.style.overflow = "hidden"
  }

  const fecharModalEmpresa = () => {
    setModalEmpresaAberto(false)
    document.body.style.overflow = "auto"
  }

  // Função para obter estados únicos dos clientes
  const obterEstadosClientes = () => {
    const estados = new Set<string>()
    clientes.forEach((cliente) => {
      if (cliente.endereco?.estado_end) {
        estados.add(cliente.endereco.estado_end)
      }
    })
    return Array.from(estados).sort()
  }

  // Função para obter estados únicos das empresas
  const obterEstadosEmpresas = () => {
    const estados = new Set<string>()
    empresas.forEach((empresa) => {
      if (empresa.endereco?.estado_end) {
        estados.add(empresa.endereco.estado_end)
      }
    })
    return Array.from(estados).sort()
  }

  // Componente de paginação simples
  const PaginacaoSimples = ({
    paginaAtual,
    totalPaginas,
    mudarPagina,
  }: {
    paginaAtual: number
    totalPaginas: number
    mudarPagina: (pagina: number) => void
  }) => {
    if (totalPaginas <= 1) return null

    return (
      <div className="flex items-center justify-center space-x-2 mt-4">
        <button
          onClick={() => paginaAtual > 1 && mudarPagina(paginaAtual - 1)}
          disabled={paginaAtual === 1}
          className={`px-3 py-1 rounded-md ${
            paginaAtual === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          Anterior
        </button>
        <span className="text-sm text-gray-600">
          Página {paginaAtual} de {totalPaginas}
        </span>
        <button
          onClick={() => paginaAtual < totalPaginas && mudarPagina(paginaAtual + 1)}
          disabled={paginaAtual === totalPaginas}
          className={`px-3 py-1 rounded-md ${
            paginaAtual === totalPaginas
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          Próxima
        </button>
      </div>
    )
  }

  // Função para formatar data
  const formatarData = (data: Date) => {
    return new Date(data).toLocaleDateString("pt-BR")
  }

  // Função para obter cor baseada no status
  const getCorStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "ativo":
        return "bg-green-100 text-green-800 border-green-200"
      case "pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "suspenso":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Função para obter ícone baseado no status
  const getIconeStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "ativo":
        return <Check className="h-4 w-4" />
      case "pendente":
        return <Clock className="h-4 w-4" />
      case "suspenso":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Renderização de estado de carregamento
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
          <div className="container mx-auto py-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
            <p className="text-center mt-4 text-gray-600">Carregando dados administrativos...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
              <p className="text-gray-600 mt-1">Gerencie clientes e empresas do sistema</p>
            </div>
            <Button
              onClick={carregarDadosSimulados}
              className="bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2"
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
                <Button onClick={carregarDadosSimulados} className="mt-4 bg-red-600 hover:bg-red-700 text-white">
                  Tentar Novamente
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Cards de resumo */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="border-blue-100">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total de Clientes</p>
                        <p className="text-3xl font-bold">{clientes.length}</p>
                      </div>
                      <div className="p-3 rounded-full bg-blue-100">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-100">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-green-600">Total de Empresas</p>
                        <p className="text-3xl font-bold">{empresas.length}</p>
                      </div>
                      <div className="p-3 rounded-full bg-green-100">
                        <Building2 className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-100">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-green-600">Empresas Ativas</p>
                        <p className="text-3xl font-bold">
                          {empresas.filter((e) => e.status.toLowerCase() === "ativo").length}
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-green-100">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-100">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total de Coletas</p>
                        <p className="text-3xl font-bold">
                          {clientes.reduce((total, cliente) => total + cliente.totalColetas, 0)}
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-gray-100">
                        <Package className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs principais */}
              <Tabs defaultValue="clientes" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="clientes" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Clientes
                  </TabsTrigger>
                  <TabsTrigger value="empresas" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Empresas
                  </TabsTrigger>
                </TabsList>

                {/* Tab de Clientes */}
                <TabsContent value="clientes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gerenciamento de Clientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Filtros e busca */}
                      <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Buscar por nome, email ou telefone..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={termoBuscaClientes}
                            onChange={(e) => setTermoBuscaClientes(e.target.value)}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <select
                              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={filtroEstadoClientes}
                              onChange={(e) => setFiltroEstadoClientes(e.target.value)}
                            >
                              <option value="todos">Todos os estados</option>
                              {obterEstadosClientes().map((estado) => (
                                <option key={estado} value={estado}>
                                  {estado}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Lista de Clientes */}
                      {clientesFiltrados.length > 0 ? (
                        <div className="space-y-4">
                          {clientesPaginaAtual.map((cliente) => (
                            <div key={cliente.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                  <h3 className="font-medium text-lg">{cliente.name}</h3>
                                  <div className="flex flex-col md:flex-row gap-4 mt-2">
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <Mail className="h-4 w-4" />
                                      <span>{cliente.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <Phone className="h-4 w-4" />
                                      <span>{cliente.tel_usu || "Não informado"}</span>
                                    </div>
                                    {cliente.endereco && (
                                      <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="h-4 w-4" />
                                        <span>
                                          {cliente.endereco.cidade_end}, {cliente.endereco.estado_end}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-center">
                                    <span className="text-sm text-gray-500">Coletas</span>
                                    <p className="font-bold text-blue-600">{cliente.totalColetas}</p>
                                  </div>
                                  <Button variant="outline" size="sm" onClick={() => abrirModalCliente(cliente)}>
                                    Ver Detalhes
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 border rounded-md">
                          <Users className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum cliente encontrado</h3>
                          <p className="text-gray-500">Tente ajustar seus filtros ou adicionar novos clientes.</p>
                        </div>
                      )}

                      {/* Paginação */}
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-gray-500">
                          Mostrando {clientesFiltrados.length > 0 ? indexPrimeiroCliente + 1 : 0} -{" "}
                          {Math.min(indexUltimoCliente, clientesFiltrados.length)} de {clientesFiltrados.length}{" "}
                          clientes
                        </div>
                        <PaginacaoSimples
                          paginaAtual={paginaAtualClientes}
                          totalPaginas={totalPaginasClientes}
                          mudarPagina={setPaginaAtualClientes}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab de Empresas */}
                <TabsContent value="empresas" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gerenciamento de Empresas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Filtros e busca */}
                      <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Buscar por nome, email ou telefone..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={termoBuscaEmpresas}
                            onChange={(e) => setTermoBuscaEmpresas(e.target.value)}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <select
                              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={filtroStatusEmpresas}
                              onChange={(e) => setFiltroStatusEmpresas(e.target.value)}
                            >
                              <option value="todos">Todos os status</option>
                              <option value="ativo">Ativo</option>
                              <option value="pendente">Pendente</option>
                              <option value="suspenso">Suspenso</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={filtroEstadoEmpresas}
                              onChange={(e) => setFiltroEstadoEmpresas(e.target.value)}
                            >
                              <option value="todos">Todos os estados</option>
                              {obterEstadosEmpresas().map((estado) => (
                                <option key={estado} value={estado}>
                                  {estado}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Lista de Empresas */}
                      {empresasFiltradas.length > 0 ? (
                        <div className="space-y-4">
                          {empresasPaginaAtual.map((empresa) => (
                            <div key={empresa.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-lg">{empresa.name}</h3>
                                    <div
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCorStatus(empresa.status)}`}
                                    >
                                      {getIconeStatus(empresa.status)}
                                      <span className="ml-1">{empresa.status}</span>
                                    </div>
                                  </div>
                                  <div className="flex flex-col md:flex-row gap-4 mt-2">
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <Mail className="h-4 w-4" />
                                      <span>{empresa.email || "Não informado"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <Phone className="h-4 w-4" />
                                      <span>{empresa.tel_empresa || "Não informado"}</span>
                                    </div>
                                    {empresa.endereco && (
                                      <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="h-4 w-4" />
                                        <span>
                                          {empresa.endereco.cidade_end}, {empresa.endereco.estado_end}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-center">
                                    <span className="text-sm text-gray-500">Coletas</span>
                                    <p className="font-bold text-green-600">{empresa.totalColetas}</p>
                                  </div>
                                  <Button variant="outline" size="sm" onClick={() => abrirModalEmpresa(empresa)}>
                                    Ver Detalhes
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 border rounded-md">
                          <Building2 className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma empresa encontrada</h3>
                          <p className="text-gray-500">Tente ajustar seus filtros ou adicionar novas empresas.</p>
                        </div>
                      )}

                      {/* Paginação */}
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-gray-500">
                          Mostrando {empresasFiltradas.length > 0 ? indexPrimeiraEmpresa + 1 : 0} -{" "}
                          {Math.min(indexUltimaEmpresa, empresasFiltradas.length)} de {empresasFiltradas.length}{" "}
                          empresas
                        </div>
                        <PaginacaoSimples
                          paginaAtual={paginaAtualEmpresas}
                          totalPaginas={totalPaginasEmpresas}
                          mudarPagina={setPaginaAtualEmpresas}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>

      {/* Modal de Detalhes do Cliente */}
      {modalClienteAberto && clienteSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                      <User className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{clienteSelecionado.name}</h2>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 ml-9">Detalhes do cliente</p>
                </div>
                <button
                  onClick={fecharModalCliente}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Informações Básicas */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Informações Básicas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <p className="text-sm text-gray-600">{clienteSelecionado.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Telefone</p>
                        <p className="text-sm text-gray-600">{clienteSelecionado.tel_usu || "Não informado"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Data de Cadastro</p>
                        <p className="text-sm text-gray-600">{formatarData(clienteSelecionado.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações de Localização */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Localização
                  </h3>
                  {clienteSelecionado.endereco ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Endereço</p>
                          <p className="text-sm text-gray-600">
                            {clienteSelecionado.endereco.cidade_end}, {clienteSelecionado.endereco.estado_end}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum endereço registrado para este cliente.</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    Histórico de Coletas
                  </h3>
                  {clienteSelecionado.totalColetas > 0 ? (
                    <div className="text-center space-y-3 py-4">
                      <p className="text-3xl font-bold text-blue-600">{clienteSelecionado.totalColetas}</p>
                      <p className="text-gray-700">coletas realizadas por este cliente</p>
                      <Button className="mt-2 bg-blue-600 hover:bg-blue-700">Ver Detalhes das Coletas</Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Este cliente ainda não realizou nenhuma coleta.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={fecharModalCliente}>
                  Fechar
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Editar Cliente</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Empresa */}
      {modalEmpresaAberto && empresaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{empresaSelecionada.name}</h2>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 ml-9">Detalhes da empresa</p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCorStatus(empresaSelecionada.status)}`}
                  >
                    {getIconeStatus(empresaSelecionada.status)}
                    <span className="ml-1">{empresaSelecionada.status}</span>
                  </div>
                  <button
                    onClick={fecharModalEmpresa}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Fechar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Informações Básicas */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-green-600" />
                    Informações Básicas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <p className="text-sm text-gray-600">{empresaSelecionada.email || "Não informado"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Telefone</p>
                        <p className="text-sm text-gray-600">{empresaSelecionada.tel_empresa || "Não informado"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Data de Cadastro</p>
                        <p className="text-sm text-gray-600">{formatarData(empresaSelecionada.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações de Localização */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Localização
                  </h3>
                  {empresaSelecionada.endereco ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Endereço</p>
                          <p className="text-sm text-gray-600">
                            {empresaSelecionada.endereco.cidade_end}, {empresaSelecionada.endereco.estado_end}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum endereço registrado para esta empresa.</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    Histórico de Coletas
                  </h3>
                  {empresaSelecionada.totalColetas > 0 ? (
                    <div className="text-center space-y-3 py-4">
                      <p className="text-3xl font-bold text-green-600">{empresaSelecionada.totalColetas}</p>
                      <p className="text-gray-700">coletas realizadas por esta empresa</p>
                      <Button className="mt-2 bg-green-600 hover:bg-green-700">Ver Detalhes das Coletas</Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Esta empresa ainda não realizou nenhuma coleta.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={fecharModalEmpresa}>
                  Fechar
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">Editar Empresa</Button>
                {empresaSelecionada.status.toLowerCase() === "ativo" ? (
                  <Button className="bg-red-600 hover:bg-red-700">Suspender Empresa</Button>
                ) : empresaSelecionada.status.toLowerCase() === "suspenso" ? (
                  <Button className="bg-green-600 hover:bg-green-700">Reativar Empresa</Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
