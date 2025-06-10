"use client"

import { useState, useEffect } from "react"
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
  Calendar,
  X,
  FileText,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
} from "lucide-react"
import { buscarUsuarios, buscarEmpresas, buscarColetasUsuario, buscarColetasEmpresa } from "./actions"

// Interfaces para os dados
interface Usuario {
  id: string
  name: string
  email: string
  tel_usu?: string | null
  cpf_usu?: string | null
  createdAt: Date
  totalColetas: number
}

interface Empresa {
  id: string
  name: string
  email: string | null
  tel_emp?: string | null
  cnpj?: string | null
  createdAt: Date | null
  totalColetas: number
  slug?: string | null
  logo?: string | null
  metadata?: string | null
}

interface Endereco {
  id: string
  endereco_usu: string
  num_end: string
  bairro_end: string
  cidade_end: string
  estado_end: string
  complemento_end?: string | null
  cep_end: string
  id_coleta?: string | null
}

interface Item {
  id: string
  itens: string
  quantidade: number
  observacao?: string | null
}

interface Coleta {
  id: string
  status_coleta: string
  data_coleta: string | Date
  id_usuario: string
  id_empresa: string | null
  usuario?: {
    name: string
    email: string
  }
  empresa?: {
    name: string
  } | null
  endereco?: Endereco
  itens: Item[]
}

export default function AdminPage() {
  // Estados para dados
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([])
  const [empresasFiltradas, setEmpresasFiltradas] = useState<Empresa[]>([])
  const [coletasUsuario, setColetasUsuario] = useState<Coleta[]>([])
  const [coletasEmpresa, setColetasEmpresa] = useState<Coleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados para filtros e buscas
  const [termoBuscaUsuarios, setTermoBuscaUsuarios] = useState("")
  const [termoBuscaEmpresas, setTermoBuscaEmpresas] = useState("")

  // Estados para modais
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null)
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(null)
  const [coletaSelecionada, setColetaSelecionada] = useState<Coleta | null>(null)
  const [modalUsuarioAberto, setModalUsuarioAberto] = useState(false)
  const [modalEmpresaAberto, setModalEmpresaAberto] = useState(false)
  const [modalColetaAberto, setModalColetaAberto] = useState(false)
  const [carregandoColetas, setCarregandoColetas] = useState(false)

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados()
  }, [])

  // Função para carregar dados
  const carregarDados = async () => {
    try {
      setLoading(true)

      // Carregar usuários e empresas em paralelo
      const [usuariosData, empresasData] = await Promise.all([buscarUsuarios(), buscarEmpresas()])

      setUsuarios(usuariosData)
      setEmpresas(empresasData)
      setUsuariosFiltrados(usuariosData)
      setEmpresasFiltradas(empresasData)
      setError(null)
    } catch (err) {
      console.error("Erro ao carregar dados:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }

  // Função para buscar coletas de um usuário
  const buscarColetasDoUsuario = async (usuarioId: string) => {
    try {
      setCarregandoColetas(true)
      const coletas = await buscarColetasUsuario(usuarioId)
      setColetasUsuario(coletas)
    } catch (err) {
      console.error("Erro ao buscar coletas do usuário:", err)
    } finally {
      setCarregandoColetas(false)
    }
  }

  // Função para buscar coletas de uma empresa
  const buscarColetasDaEmpresa = async (empresaId: string) => {
    try {
      setCarregandoColetas(true)
      const coletas = await buscarColetasEmpresa(empresaId)
      setColetasEmpresa(coletas)
    } catch (err) {
      console.error("Erro ao buscar coletas da empresa:", err)
    } finally {
      setCarregandoColetas(false)
    }
  }

  // Função para filtrar usuários
  const filtrarUsuarios = () => {
    if (!termoBuscaUsuarios.trim()) {
      setUsuariosFiltrados(usuarios)
      return
    }

    const termo = termoBuscaUsuarios.toLowerCase()
    const filtrados = usuarios.filter(
      (usuario) =>
        usuario.name.toLowerCase().includes(termo) ||
        usuario.email.toLowerCase().includes(termo) ||
        (usuario.tel_usu && usuario.tel_usu.toLowerCase().includes(termo)) ||
        (usuario.cpf_usu && usuario.cpf_usu.includes(termo)),
    )
    setUsuariosFiltrados(filtrados)
  }

  // Função para filtrar empresas
  const filtrarEmpresas = () => {
    if (!termoBuscaEmpresas.trim()) {
      setEmpresasFiltradas(empresas)
      return
    }

    const termo = termoBuscaEmpresas.toLowerCase()
    const filtradas = empresas.filter(
      (empresa) =>
        empresa.name.toLowerCase().includes(termo) ||
        (empresa.email && empresa.email.toLowerCase().includes(termo)) ||
        (empresa.tel_emp && empresa.tel_emp.toLowerCase().includes(termo)) ||
        (empresa.cnpj && empresa.cnpj.includes(termo)),
    )
    setEmpresasFiltradas(filtradas)
  }

  // Aplicar filtros quando os critérios mudarem
  useEffect(() => {
    filtrarUsuarios()
  }, [termoBuscaUsuarios, usuarios])

  useEffect(() => {
    filtrarEmpresas()
  }, [termoBuscaEmpresas, empresas])

  // Funções para modais
  const abrirModalUsuario = async (usuario: Usuario) => {
    setUsuarioSelecionado(usuario)
    await buscarColetasDoUsuario(usuario.id)
    setModalUsuarioAberto(true)
    document.body.style.overflow = "hidden"
  }

  const fecharModalUsuario = () => {
    setModalUsuarioAberto(false)
    document.body.style.overflow = "auto"
  }

  const abrirModalEmpresa = async (empresa: Empresa) => {
    setEmpresaSelecionada(empresa)
    await buscarColetasDaEmpresa(empresa.id)
    setModalEmpresaAberto(true)
    document.body.style.overflow = "hidden"
  }

  const fecharModalEmpresa = () => {
    setModalEmpresaAberto(false)
    document.body.style.overflow = "auto"
  }

  const abrirModalColeta = (coleta: Coleta) => {
    setColetaSelecionada(coleta)
    setModalColetaAberto(true)
    document.body.style.overflow = "hidden"
  }

  const fecharModalColeta = () => {
    setModalColetaAberto(false)
    document.body.style.overflow = "auto"
  }

  // Função para formatar data
  const formatarData = (dataString: string | Date | null) => {
    if (!dataString) return "Data não disponível"
    return new Date(dataString).toLocaleDateString("pt-BR")
  }

  // Função para formatar hora
  const formatarHora = (dataString: string | Date) => {
    return new Date(dataString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Função para formatar CPF
  const formatarCPF = (cpf: string | null | undefined) => {
    if (!cpf) return "Não informado"
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  // Função para formatar CNPJ
  const formatarCNPJ = (cnpj: string | null | undefined) => {
    if (!cnpj) return "Não informado"
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  }

  // Função para obter cor do status
  const getCorStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "solicitado":
        return "bg-blue-100 text-blue-800"
      case "confirmado":
        return "bg-green-100 text-green-800"
      case "em andamento":
        return "bg-yellow-100 text-yellow-800"
      case "concluído":
        return "bg-green-500 text-white"
      case "cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  // Renderização de estado de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
        <div className="container mx-auto py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
          <p className="text-center mt-4 text-gray-600">Carregando dados administrativos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
            <p className="text-gray-600 mt-1">Gerencie usuários, empresas e coletas</p>
          </div>
          <Button onClick={carregarDados} className="bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2">
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
              <Button onClick={carregarDados} className="mt-4 bg-red-600 hover:bg-red-700 text-white">
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
                      <p className="text-sm font-medium text-blue-600">Total de Usuários</p>
                      <p className="text-3xl font-bold">{usuarios.length}</p>
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

              <Card className="border-yellow-100">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Total de Coletas</p>
                      <p className="text-3xl font-bold">
                        {usuarios.reduce((total, usuario) => total + usuario.totalColetas, 0)}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-yellow-100">
                      <Package className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-100">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Coletas por Empresa</p>
                      <p className="text-3xl font-bold">
                        {empresas.reduce((total, empresa) => total + empresa.totalColetas, 0)}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                      <Truck className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs principais */}
            <Tabs defaultValue="usuarios" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="usuarios" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Usuários
                </TabsTrigger>
                <TabsTrigger value="empresas" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Empresas
                </TabsTrigger>
              </TabsList>

              {/* Tab de Usuários */}
              <TabsContent value="usuarios" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Lista de Usuários</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Busca */}
                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar por nome, email, telefone ou CPF..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={termoBuscaUsuarios}
                        onChange={(e) => setTermoBuscaUsuarios(e.target.value)}
                      />
                    </div>

                    {/* Lista de Usuários */}
                    {usuariosFiltrados.length > 0 ? (
                      <div className="space-y-4">
                        {usuariosFiltrados.map((usuario) => (
                          <div key={usuario.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <h3 className="font-medium text-lg">{usuario.name}</h3>
                                <div className="flex flex-col md:flex-row gap-4 mt-2">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="h-4 w-4" />
                                    <span>{usuario.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="h-4 w-4" />
                                    <span>{usuario.tel_usu || "Não informado"}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <FileText className="h-4 w-4" />
                                    <span>CPF: {formatarCPF(usuario.cpf_usu)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-center">
                                  <span className="text-sm text-gray-500">Coletas</span>
                                  <p className="font-bold text-blue-600">{usuario.totalColetas}</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => abrirModalUsuario(usuario)}>
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
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum usuário encontrado</h3>
                        <p className="text-gray-500">Tente ajustar seus critérios de busca.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab de Empresas */}
              <TabsContent value="empresas" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Lista de Empresas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Busca */}
                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar por nome, email, telefone ou CNPJ..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={termoBuscaEmpresas}
                        onChange={(e) => setTermoBuscaEmpresas(e.target.value)}
                      />
                    </div>

                    {/* Lista de Empresas */}
                    {empresasFiltradas.length > 0 ? (
                      <div className="space-y-4">
                        {empresasFiltradas.map((empresa) => (
                          <div key={empresa.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <h3 className="font-medium text-lg">{empresa.name}</h3>
                                <div className="flex flex-col md:flex-row gap-4 mt-2">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="h-4 w-4" />
                                    <span>{empresa.email || "Não informado"}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="h-4 w-4" />
                                    <span>{empresa.tel_emp || "Não informado"}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <FileText className="h-4 w-4" />
                                    <span>CNPJ: {formatarCNPJ(empresa.cnpj)}</span>
                                  </div>
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
                        <p className="text-gray-500">Tente ajustar seus critérios de busca.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Modal de Detalhes do Usuário */}
      {modalUsuarioAberto && usuarioSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                      <User className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{usuarioSelecionado.name}</h2>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 ml-9">Detalhes do usuário</p>
                </div>
                <button
                  onClick={fecharModalUsuario}
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
                        <p className="text-sm text-gray-600">{usuarioSelecionado.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Telefone</p>
                        <p className="text-sm text-gray-600">{usuarioSelecionado.tel_usu || "Não informado"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">CPF</p>
                        <p className="text-sm text-gray-600">{formatarCPF(usuarioSelecionado.cpf_usu)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Data de Cadastro</p>
                        <p className="text-sm text-gray-600">{formatarData(usuarioSelecionado.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumo de Coletas */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    Resumo de Coletas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-700">Total de coletas:</p>
                      <p className="font-bold text-blue-600">{usuarioSelecionado.totalColetas}</p>
                    </div>
                    {carregandoColetas ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-700">Coletas solicitadas:</p>
                          <p className="font-medium">
                            {coletasUsuario.filter((c) => c.status_coleta === "Solicitado").length}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-700">Coletas confirmadas:</p>
                          <p className="font-medium">
                            {coletasUsuario.filter((c) => c.status_coleta === "Confirmado").length}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-700">Coletas em andamento:</p>
                          <p className="font-medium">
                            {coletasUsuario.filter((c) => c.status_coleta === "Em andamento").length}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-700">Coletas concluídas:</p>
                          <p className="font-medium">
                            {coletasUsuario.filter((c) => c.status_coleta === "Concluído").length}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-700">Coletas canceladas:</p>
                          <p className="font-medium">
                            {coletasUsuario.filter((c) => c.status_coleta === "Cancelado").length}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Lista de Coletas */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Histórico de Coletas
                </h3>

                {carregandoColetas ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                  </div>
                ) : coletasUsuario.length > 0 ? (
                  <div className="space-y-4">
                    {coletasUsuario.map((coleta) => (
                      <div
                        key={coleta.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => abrirModalColeta(coleta)}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">Coleta #{coleta.id.substring(0, 8)}</h4>
                              <div
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCorStatus(
                                  coleta.status_coleta,
                                )}`}
                              >
                                {getIconeStatus(coleta.status_coleta)}
                                <span className="ml-1">{coleta.status_coleta}</span>
                              </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 mt-2">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {formatarData(coleta.data_coleta)} às {formatarHora(coleta.data_coleta)}
                                </span>
                              </div>
                              {coleta.empresa && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Building2 className="h-4 w-4" />
                                  <span>Empresa: {coleta.empresa.name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md">
                    <Package className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma coleta encontrada</h3>
                    <p className="text-gray-500">Este usuário ainda não realizou nenhuma coleta.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={fecharModalUsuario}>
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Empresa */}
      {modalEmpresaAberto && empresaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
                <button
                  onClick={fecharModalEmpresa}
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
                        <p className="text-sm text-gray-600">{empresaSelecionada.tel_emp || "Não informado"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">CNPJ</p>
                        <p className="text-sm text-gray-600">{formatarCNPJ(empresaSelecionada.cnpj)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Data de Cadastro</p>
                        <p className="text-sm text-gray-600">{formatarData(empresaSelecionada.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumo de Coletas */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    Resumo de Coletas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-700">Total de coletas:</p>
                      <p className="font-bold text-green-600">{empresaSelecionada.totalColetas}</p>
                    </div>
                    {carregandoColetas ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-700"></div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-700">Coletas confirmadas:</p>
                          <p className="font-medium">
                            {coletasEmpresa.filter((c) => c.status_coleta === "Confirmado").length}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-700">Coletas em andamento:</p>
                          <p className="font-medium">
                            {coletasEmpresa.filter((c) => c.status_coleta === "Em andamento").length}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-700">Coletas concluídas:</p>
                          <p className="font-medium">
                            {coletasEmpresa.filter((c) => c.status_coleta === "Concluído").length}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-700">Coletas canceladas:</p>
                          <p className="font-medium">
                            {coletasEmpresa.filter((c) => c.status_coleta === "Cancelado").length}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Lista de Coletas */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  Histórico de Coletas
                </h3>

                {carregandoColetas ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
                  </div>
                ) : coletasEmpresa.length > 0 ? (
                  <div className="space-y-4">
                    {coletasEmpresa.map((coleta) => (
                      <div
                        key={coleta.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => abrirModalColeta(coleta)}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">Coleta #{coleta.id.substring(0, 8)}</h4>
                              <div
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCorStatus(
                                  coleta.status_coleta,
                                )}`}
                              >
                                {getIconeStatus(coleta.status_coleta)}
                                <span className="ml-1">{coleta.status_coleta}</span>
                              </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 mt-2">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {formatarData(coleta.data_coleta)} às {formatarHora(coleta.data_coleta)}
                                </span>
                              </div>
                              {coleta.usuario && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <User className="h-4 w-4" />
                                  <span>Cliente: {coleta.usuario.name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md">
                    <Package className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma coleta encontrada</h3>
                    <p className="text-gray-500">Esta empresa ainda não realizou nenhuma coleta.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={fecharModalEmpresa}>
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Coleta */}
      {modalColetaAberto && coletaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                      <Package className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Coleta #{coletaSelecionada.id.substring(0, 8)}</h2>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 ml-9">Detalhes da coleta</p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCorStatus(
                      coletaSelecionada.status_coleta,
                    )}`}
                  >
                    {getIconeStatus(coletaSelecionada.status_coleta)}
                    <span className="ml-1">{coletaSelecionada.status_coleta}</span>
                  </div>
                  <button
                    onClick={fecharModalColeta}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Fechar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Informações da Coleta */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                    Informações da Coleta
                  </h3>
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
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCorStatus(
                          coletaSelecionada.status_coleta,
                        )}`}
                      >
                        {coletaSelecionada.status_coleta}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informações do Cliente/Empresa */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    {coletaSelecionada.usuario ? (
                      <>
                        <User className="h-5 w-5 text-yellow-600" />
                        Informações do Cliente
                      </>
                    ) : (
                      <>
                        <Building2 className="h-5 w-5 text-yellow-600" />
                        Informações da Empresa
                      </>
                    )}
                  </h3>
                  <div className="space-y-3">
                    {coletaSelecionada.usuario && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nome:</span>
                          <span className="font-medium">{coletaSelecionada.usuario.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{coletaSelecionada.usuario.email}</span>
                        </div>
                      </>
                    )}
                    {coletaSelecionada.empresa && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Empresa:</span>
                          <span className="font-medium">{coletaSelecionada.empresa.name}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Endereço */}
              {coletaSelecionada.endereco && (
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-yellow-600" />
                    Endereço de Coleta
                  </h3>
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
                </div>
              )}

              {/* Itens para Coleta */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-yellow-600" />
                  Itens para Coleta
                </h3>
                {coletaSelecionada.itens && coletaSelecionada.itens.length > 0 ? (
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
                ) : (
                  <p className="text-gray-500">Nenhum item registrado para esta coleta.</p>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={fecharModalColeta}>
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
