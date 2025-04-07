"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Clock,
  MapPin,
  Package,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  X,
  Truck,
  ArrowLeft,
  Leaf,
} from "lucide-react"
import { buscarAgendamentos, cancelarColeta } from "./actions"

// Tipos para os dados
interface Endereco {
  id: string
  endereco_usu: string
  num_end: string
  bairro_end: string
  cidade_end: string
  estado_end: string
  complemento_end?: string | null
  cep_end: string
  id_coleta: string | null
}

interface Item {
  id: string
  itens: string
  quantidade: number
  observacao?: string | null
  id_coleta: string
}

interface Coleta {
  id: string
  status_coleta: string
  destinacao_final: string | null
  data_coleta: Date | string
  id_usuario: string
  id_empresa: string | null
  endereco?: Endereco
  itens: Item[]
}

export default function AgendamentosPage() {
  const router = useRouter()
  const [agendamentos, setAgendamentos] = useState<Coleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedColeta, setSelectedColeta] = useState<Coleta | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [cancelando, setCancelando] = useState(false)
  const [mensagemCancelamento, setMensagemCancelamento] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(
    null,
  )

  // Função para carregar os agendamentos
  const carregarAgendamentos = async () => {
    try {
      setLoading(true)
      const dados = await buscarAgendamentos()
      setAgendamentos(dados as Coleta[])
      setError(null)
    } catch (err) {
      console.error("Erro ao carregar agendamentos:", err)
      setError("Não foi possível carregar seus agendamentos. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarAgendamentos()
  }, [])

  // Função para abrir o modal de detalhes
  const openDetails = (coleta: Coleta) => {
    setSelectedColeta(coleta)
    setDetailsOpen(true)
    // Limpar mensagem de cancelamento ao abrir o modal
    setMensagemCancelamento(null)
    // Impedir o scroll da página quando o modal está aberto
    document.body.style.overflow = "hidden"
  }

  // Função para fechar o modal de detalhes
  const closeDetails = () => {
    setDetailsOpen(false)
    // Restaurar o scroll da página
    document.body.style.overflow = "auto"
  }

  // Função para cancelar uma coleta
  const handleCancelarColeta = async () => {
    if (!selectedColeta) return

    try {
      setCancelando(true)
      setMensagemCancelamento(null)

      await cancelarColeta(selectedColeta.id)

      // Atualizar o status da coleta na interface
      setSelectedColeta({
        ...selectedColeta,
        status_coleta: "Cancelado",
      })

      // Atualizar a lista de agendamentos
      setAgendamentos((prev) =>
        prev.map((coleta) => (coleta.id === selectedColeta.id ? { ...coleta, status_coleta: "Cancelado" } : coleta)),
      )

      setMensagemCancelamento({
        tipo: "sucesso",
        texto: "Coleta cancelada com sucesso!",
      })
    } catch (err: any) {
      console.error("Erro ao cancelar coleta:", err)
      setMensagemCancelamento({
        tipo: "erro",
        texto: err.message || "Não foi possível cancelar a coleta. Tente novamente mais tarde.",
      })
    } finally {
      setCancelando(false)
    }
  }

  // Função para formatar a data
  const formatarData = (dataString: Date | string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/Sao_Paulo",
    })
  }

  // Função para formatar a hora
  const formatarHora = (dataString: Date | string) => {
    const data = new Date(dataString)
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo",
    })
  }

  // Função para formatar o endereço resumido
  const formatarEnderecoResumido = (endereco: Endereco) => {
    return `${endereco.endereco_usu}, ${endereco.num_end} - ${endereco.bairro_end}`
  }

  // Função para formatar o endereço completo
  const formatarEnderecoCompleto = (endereco: Endereco) => {
    return `${endereco.endereco_usu}, ${endereco.num_end}${endereco.complemento_end ? `, ${endereco.complemento_end}` : ""} - ${endereco.bairro_end}, ${endereco.cidade_end} - ${endereco.estado_end}, ${endereco.cep_end}`
  }

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
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

  // Função para obter o ícone do status
  const getStatusIcon = (status: string) => {
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
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Renderização de estado de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-6 text-green-800">Meus Agendamentos</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full border rounded-lg p-4 shadow-sm bg-white">
                <div className="pb-2">
                  <div className="h-6 w-32 mb-2 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="py-4">
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="h-9 w-28 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Renderização de erro
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-6 text-green-800">Meus Agendamentos</h1>
          <div className="w-full bg-red-50 border border-red-200 rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </div>
            <div className="p-4 border-t border-red-200">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-red-300 text-red-700 hover:bg-red-100 rounded-md transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Meus Agendamentos</h1>
            <p className="text-green-600 mt-1">Acompanhe suas solicitações de coleta de lixo eletrônico</p>
          </div>
          <button
            onClick={() => router.push("/agendamentos/novo")}
            className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-md shadow-md transition-all hover:shadow-lg flex items-center gap-2"
          >
            <Leaf className="h-4 w-4" />
            Novo Agendamento
          </button>
        </div>

        {agendamentos.length === 0 ? (
          <div className="w-full bg-white border rounded-xl shadow-md overflow-hidden">
            <div className="p-8 flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <Package className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-3">Nenhum agendamento encontrado</h3>
              <p className="text-gray-500 text-center mb-6 max-w-md">
                Você ainda não possui agendamentos de coleta de lixo eletrônico. Contribua com o meio ambiente agendando
                uma coleta agora mesmo.
              </p>
              <button
                onClick={() => router.push("/agendamentos/novo")}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-md shadow-md transition-all hover:shadow-lg flex items-center gap-2"
              >
                <Leaf className="h-4 w-4" />
                Agendar Coleta
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {agendamentos.map((agendamento) => (
              <div
                key={agendamento.id}
                className="w-full border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative"
              >
                {/* Barra colorida lateral baseada no status */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    agendamento.status_coleta.toLowerCase() === "solicitado"
                      ? "bg-blue-500"
                      : agendamento.status_coleta.toLowerCase() === "confirmado"
                        ? "bg-green-500"
                        : agendamento.status_coleta.toLowerCase() === "em andamento"
                          ? "bg-yellow-500"
                          : agendamento.status_coleta.toLowerCase() === "concluído"
                            ? "bg-green-600"
                            : "bg-red-500"
                  }`}
                ></div>

                <div className="pl-2">
                  <div className="pb-3 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Coleta #{agendamento.id.substring(0, 8)}</h3>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(agendamento.status_coleta)}`}
                      >
                        {getStatusIcon(agendamento.status_coleta)}
                        {agendamento.status_coleta}
                      </div>
                    </div>
                  </div>
                  <div className="py-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-start gap-2">
                        <div className="p-2 rounded-full bg-green-100 text-green-600 mt-0.5">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Data e Hora</p>
                          <p className="text-sm text-gray-600">
                            {formatarData(agendamento.data_coleta)} às {formatarHora(agendamento.data_coleta)}
                          </p>
                        </div>
                      </div>

                      {agendamento.endereco && (
                        <div className="flex items-start gap-2">
                          <div className="p-2 rounded-full bg-green-100 text-green-600 mt-0.5">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Endereço</p>
                            <p className="text-sm text-gray-600">{formatarEnderecoResumido(agendamento.endereco)}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-2">
                        <div className="p-2 rounded-full bg-green-100 text-green-600 mt-0.5">
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Itens para coleta</p>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {agendamento.itens.length > 0
                              ? agendamento.itens.map((item) => `${item.quantidade} ${item.itens}`).join(", ")
                              : "Nenhum item registrado"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-green-50 to-green-100 text-green-700 hover:from-green-100 hover:to-green-200 rounded-lg flex justify-between items-center transition-all border border-green-200"
                      onClick={() => openDetails(agendamento)}
                    >
                      <span className="font-medium">Ver Detalhes</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Detalhes (sem usar Dialog) */}
        {detailsOpen && selectedColeta && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-green-100 text-green-600">
                        <Truck className="h-5 w-5" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">Coleta #{selectedColeta.id.substring(0, 8)}</h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 ml-9">Detalhes completos do seu agendamento</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(selectedColeta.status_coleta)}`}
                    >
                      {getStatusIcon(selectedColeta.status_coleta)}
                      {selectedColeta.status_coleta}
                    </div>
                    <button
                      onClick={closeDetails}
                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label="Fechar"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Mensagem de cancelamento */}
                {mensagemCancelamento && (
                  <div
                    className={`p-4 rounded-lg mb-6 ${
                      mensagemCancelamento.tipo === "sucesso"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    <p className="flex items-center gap-2">
                      {mensagemCancelamento.tipo === "sucesso" ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                      {mensagemCancelamento.texto}
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  {/* Confirmation Details */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-green-600" />
                        Detalhes do Agendamento
                      </h3>
                      <div className="space-y-3 text-gray-700">
                        <p className="flex justify-between">
                          <span className="font-medium">Data agendada:</span>
                          <span>{formatarData(selectedColeta.data_coleta)}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium">Horário agendado:</span>
                          <span>{formatarHora(selectedColeta.data_coleta)}</span>
                        </p>
                        <p className="flex justify-between items-center">
                          <span className="font-medium">Status atual:</span>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getStatusColor(selectedColeta.status_coleta)}`}
                          >
                            {getStatusIcon(selectedColeta.status_coleta)}
                            {selectedColeta.status_coleta}
                          </span>
                        </p>
                      </div>
                    </div>

                    {selectedColeta.endereco && (
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
                        <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-green-600" />
                          Endereço de Coleta
                        </h3>
                        <div className="space-y-2 text-gray-700">
                          <p className="leading-relaxed">{formatarEnderecoCompleto(selectedColeta.endereco)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <Package className="h-5 w-5 text-green-600" />
                      Itens para Coleta
                    </h3>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
                      {selectedColeta.itens.length > 0 ? (
                        <ul className="divide-y divide-green-200">
                          {selectedColeta.itens.map((item) => (
                            <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-full bg-white text-green-600 mt-0.5">
                                  <CheckCircle className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {item.quantidade} {item.itens}
                                  </p>
                                  {item.observacao && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      <span className="font-medium">Observação:</span> {item.observacao}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex items-center justify-center py-6 text-gray-500">
                          <p>Nenhum item encontrado para esta coleta.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      Status da Coleta
                    </h3>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-200"></div>

                        <div className="relative pl-12 pb-8">
                          <div className="absolute left-2 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                          <p className="font-medium text-gray-800">Solicitado</p>
                          <p className="text-sm text-gray-600">Sua solicitação de coleta foi registrada com sucesso.</p>
                        </div>

                        {selectedColeta.status_coleta === "Cancelado" ? (
                          <div className="relative pl-12">
                            <div className="absolute left-2 w-5 h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
                              <X className="h-3 w-3 text-white" />
                            </div>
                            <p className="font-medium text-gray-800">Cancelado</p>
                            <p className="text-sm text-gray-600">Esta coleta foi cancelada e não será realizada.</p>
                          </div>
                        ) : (
                          <>
                            <div
                              className={`relative pl-12 pb-8 ${selectedColeta.status_coleta === "Solicitado" ? "opacity-50" : ""}`}
                            >
                              <div
                                className={`absolute left-2 w-5 h-5 rounded-full ${selectedColeta.status_coleta !== "Solicitado" ? "bg-green-500" : "bg-gray-300"} border-2 border-white flex items-center justify-center`}
                              >
                                {selectedColeta.status_coleta !== "Solicitado" ? (
                                  <CheckCircle className="h-3 w-3 text-white" />
                                ) : null}
                              </div>
                              <p className="font-medium text-gray-800">Confirmado</p>
                              <p className="text-sm text-gray-600">Sua coleta foi confirmada e está agendada.</p>
                            </div>

                            <div
                              className={`relative pl-12 pb-8 ${["Solicitado", "Confirmado"].includes(selectedColeta.status_coleta) ? "opacity-50" : ""}`}
                            >
                              <div
                                className={`absolute left-2 w-5 h-5 rounded-full ${!["Solicitado", "Confirmado"].includes(selectedColeta.status_coleta) ? "bg-green-500" : "bg-gray-300"} border-2 border-white flex items-center justify-center`}
                              >
                                {!["Solicitado", "Confirmado"].includes(selectedColeta.status_coleta) ? (
                                  <CheckCircle className="h-3 w-3 text-white" />
                                ) : null}
                              </div>
                              <p className="font-medium text-gray-800">Em Andamento</p>
                              <p className="text-sm text-gray-600">
                                Nosso coletor está a caminho para retirar seus itens.
                              </p>
                            </div>

                            <div
                              className={`relative pl-12 ${selectedColeta.status_coleta !== "Concluído" ? "opacity-50" : ""}`}
                            >
                              <div
                                className={`absolute left-2 w-5 h-5 rounded-full ${selectedColeta.status_coleta === "Concluído" ? "bg-green-500" : "bg-gray-300"} border-2 border-white flex items-center justify-center`}
                              >
                                {selectedColeta.status_coleta === "Concluído" ? (
                                  <CheckCircle className="h-3 w-3 text-white" />
                                ) : null}
                              </div>
                              <p className="font-medium text-gray-800">Concluído</p>
                              <p className="text-sm text-gray-600">
                                Sua coleta foi realizada com sucesso. Obrigado por contribuir com o meio ambiente!
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                    <button
                      className="px-5 py-2.5 border border-green-200 text-green-700 bg-white hover:bg-green-50 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                      onClick={closeDetails}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Voltar para Agendamentos
                    </button>

                    {selectedColeta.status_coleta === "Solicitado" && (
                      <button
                        className={`px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm ${
                          cancelando ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        onClick={handleCancelarColeta}
                        disabled={cancelando}
                      >
                        {cancelando ? (
                          <>
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                            Cancelando...
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4" />
                            Cancelar Agendamento
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="max-w-3xl mx-auto mt-10 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-3">Precisa de ajuda?</h3>
              <p className="mb-4 text-green-50">
                Nossa equipe está pronta para esclarecer suas dúvidas sobre o descarte de lixo eletrônico e ajudar com
                seus agendamentos.
              </p>
              <div className="flex items-center gap-3 text-green-100">
                <Clock className="h-5 w-5" />
                <span>(11) 9999-9999</span>
              </div>
            </div>
            <div className="md:self-center">
              <button className="w-full md:w-auto bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all font-medium">
                Fale Conosco
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

