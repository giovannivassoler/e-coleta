"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";


// Tipos para os diferentes estados de coleta
type ColetaSolicitada = {
  id: string;
  data: string;
  endereco: string;
  tipoLixo: string;
  quantidade: string;
  solicitante: string;
  telefone: string;
};

type ColetaAndamento = {
  id: string;
  previsao: string;
  endereco: string;
  tipoLixo: string;
  quantidade: string;
  solicitante: string;
  telefone: string;
};

type ColetaFinalizada = {
  id: string;
  finalizada: string;
  endereco: string;
  tipoLixo: string;
  quantidade: string;
  solicitante: string;
  telefone: string;
};

// Dados de exemplo
const coletasSolicitadasIniciais: ColetaSolicitada[] = [
  {
    id: "1343151",
    data: "10/12/24",
    endereco: "Rua das Flores, 123",
    tipoLixo: "Computadores e Monitores",
    quantidade: "3 itens",
    solicitante: "João Silva",
    telefone: "(11) 98765-4321",
  },
  {
    id: "1343152",
    data: "10/12/24",
    endereco: "Av. Paulista, 1000",
    tipoLixo: "Celulares e Tablets",
    quantidade: "5 itens",
    solicitante: "Maria Oliveira",
    telefone: "(11) 91234-5678",
  },
  {
    id: "1343153",
    data: "11/12/24",
    endereco: "Rua Augusta, 500",
    tipoLixo: "Eletrodomésticos",
    quantidade: "2 itens",
    solicitante: "Pedro Santos",
    telefone: "(11) 97777-8888",
  },
  {
    id: "1343154",
    data: "11/12/24",
    endereco: "Rua Vergueiro, 800",
    tipoLixo: "Baterias e Pilhas",
    quantidade: "10 itens",
    solicitante: "Ana Costa",
    telefone: "(11) 96666-7777",
  },
  {
    id: "1343155",
    data: "12/12/24",
    endereco: "Av. Rebouças, 300",
    tipoLixo: "Impressoras",
    quantidade: "1 item",
    solicitante: "Carlos Ferreira",
    telefone: "(11) 95555-6666",
  },
];

const coletasAndamentoIniciais: ColetaAndamento[] = [
  {
    id: "1343131",
    previsao: "11/12/24",
    endereco: "Rua dos Pinheiros, 50",
    tipoLixo: "Computadores",
    quantidade: "2 itens",
    solicitante: "Roberto Alves",
    telefone: "(11) 94444-5555",
  },
  {
    id: "1343132",
    previsao: "11/12/24",
    endereco: "Av. Brigadeiro, 200",
    tipoLixo: "Televisores",
    quantidade: "3 itens",
    solicitante: "Fernanda Lima",
    telefone: "(11) 93333-4444",
  },
  {
    id: "1343133",
    previsao: "11/12/24",
    endereco: "Rua Oscar Freire, 100",
    tipoLixo: "Cabos e Periféricos",
    quantidade: "15 itens",
    solicitante: "Marcelo Souza",
    telefone: "(11) 92222-3333",
  },
  {
    id: "1343134",
    previsao: "11/12/24",
    endereco: "Av. Faria Lima, 500",
    tipoLixo: "Notebooks",
    quantidade: "4 itens",
    solicitante: "Juliana Mendes",
    telefone: "(11) 91111-2222",
  },
  {
    id: "1343135",
    previsao: "11/12/24",
    endereco: "Rua Consolação, 300",
    tipoLixo: "Equipamentos de Áudio",
    quantidade: "6 itens",
    solicitante: "Ricardo Gomes",
    telefone: "(11) 90000-1111",
  },
  {
    id: "1343136",
    previsao: "11/12/24",
    endereco: "Av. Paulista, 2000",
    tipoLixo: "Tablets",
    quantidade: "3 itens",
    solicitante: "Camila Rocha",
    telefone: "(11) 99999-0000",
  },
  {
    id: "1343137",
    previsao: "11/12/24",
    endereco: "Rua Augusta, 1000",
    tipoLixo: "Celulares",
    quantidade: "8 itens",
    solicitante: "Rodrigo Silva",
    telefone: "(11) 98888-9999",
  },
];

const coletasFinalizadasIniciais: ColetaFinalizada[] = [
  {
    id: "1343151",
    finalizada: "13/12/24",
    endereco: "Rua Haddock Lobo, 150",
    tipoLixo: "Computadores",
    quantidade: "5 itens",
    solicitante: "Luciana Martins",
    telefone: "(11) 97777-6666",
  },
  {
    id: "1343152",
    finalizada: "13/12/24",
    endereco: "Av. Santo Amaro, 400",
    tipoLixo: "Impressoras",
    quantidade: "2 itens",
    solicitante: "Eduardo Pereira",
    telefone: "(11) 96666-5555",
  },
  {
    id: "1343153",
    finalizada: "13/12/24",
    endereco: "Rua Teodoro Sampaio, 250",
    tipoLixo: "Monitores",
    quantidade: "4 itens",
    solicitante: "Beatriz Oliveira",
    telefone: "(11) 95555-4444",
  },
  {
    id: "1343154",
    finalizada: "13/12/24",
    endereco: "Av. Rebouças, 800",
    tipoLixo: "Baterias",
    quantidade: "20 itens",
    solicitante: "Gabriel Santos",
    telefone: "(11) 94444-3333",
  },
  {
    id: "1343155",
    finalizada: "13/12/24",
    endereco: "Rua da Consolação, 600",
    tipoLixo: "Eletrodomésticos",
    quantidade: "3 itens",
    solicitante: "Amanda Costa",
    telefone: "(11) 93333-2222",
  },
  {
    id: "1343156",
    finalizada: "13/12/24",
    endereco: "Av. Paulista, 1500",
    tipoLixo: "Cabos e Periféricos",
    quantidade: "12 itens",
    solicitante: "Rafael Almeida",
    telefone: "(11) 92222-1111",
  },
  {
    id: "1343157",
    finalizada: "13/12/24",
    endereco: "Rua Augusta, 700",
    tipoLixo: "Celulares",
    quantidade: "6 itens",
    solicitante: "Carolina Lima",
    telefone: "(11) 91111-0000",
  },
];

type Coleta = ColetaSolicitada | ColetaAndamento | ColetaFinalizada;

// Componente de detalhes da coleta
function DetalhesColeta({ dados }: { dados: Coleta }) {
  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">ID da Coleta</h3>
          <p className="text-sm">{dados.id}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">
            {"data" in dados
              ? "Data da Solicitação"
              : "previsao" in dados
              ? "Previsão de Coleta"
              : "Data de Finalização"}
          </h3>
          <p className="text-sm">
            {"data" in dados
              ? dados.data
              : "previsao" in dados
              ? dados.previsao
              : dados.finalizada}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Solicitante</h3>
          <p className="text-sm">{dados.solicitante}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
          <p className="text-sm">{dados.telefone}</p>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-gray-500">Endereço</h3>
          <p className="text-sm">{dados.endereco}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">
            Tipo de Lixo Eletrônico
          </h3>
          <p className="text-sm">{dados.tipoLixo}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Quantidade</h3>
          <p className="text-sm">{dados.quantidade}</p>
        </div>
      </div>
    </div>
  );
}

// Componente de diálogo simples
function SimpleDialog({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="p-4 border-t">{footer}</div>}
      </div>
    </div>
  );
}

// Tipo para as abas
type TabType = "solicitadas" | "andamento" | "finalizadas";

// Componente principal
export default function GerenciamentoColetas() {
  const [coletasSolicitadas, setColetasSolicitadas] = useState<
    ColetaSolicitada[]
  >(coletasSolicitadasIniciais);
  const [coletasAndamento, setColetasAndamento] = useState<ColetaAndamento[]>(
    coletasAndamentoIniciais
  );
  const [coletasFinalizadas, setColetasFinalizadas] = useState<
    ColetaFinalizada[]
  >(coletasFinalizadasIniciais);
  const [selectedColeta, setSelectedColeta] = useState<Coleta | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("solicitadas");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Função para aceitar uma coleta
  const aceitarColeta = (coleta: ColetaSolicitada) => {
    // Remove da lista de solicitadas
    setColetasSolicitadas(coletasSolicitadas.filter((c) => c.id !== coleta.id));

    // Adiciona à lista de andamento
    const novaColetaAndamento: ColetaAndamento = {
      id: coleta.id,
      previsao: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }
      ),
      endereco: coleta.endereco,
      tipoLixo: coleta.tipoLixo,
      quantidade: coleta.quantidade,
      solicitante: coleta.solicitante,
      telefone: coleta.telefone,
    };

    setColetasAndamento([novaColetaAndamento, ...coletasAndamento]);
  };

  // Função para rejeitar uma coleta
  const rejeitarColeta = (coleta: ColetaSolicitada) => {
    setColetasSolicitadas(coletasSolicitadas.filter((c) => c.id !== coleta.id));
  };

  // Função para finalizar uma coleta
  const finalizarColeta = (coleta: ColetaAndamento) => {
    // Remove da lista de andamento
    setColetasAndamento(coletasAndamento.filter((c) => c.id !== coleta.id));

    // Adiciona à lista de finalizadas
    const novaColetaFinalizada: ColetaFinalizada = {
      id: coleta.id,
      finalizada: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      endereco: coleta.endereco,
      tipoLixo: coleta.tipoLixo,
      quantidade: coleta.quantidade,
      solicitante: coleta.solicitante,
      telefone: coleta.telefone,
    };

    setColetasFinalizadas([novaColetaFinalizada, ...coletasFinalizadas]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
  

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-emerald-800">
            Gerenciamento de Coletas
          </h1>

          {/* Abas de navegação */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "solicitadas"
                  ? "border-b-2 border-emerald-500 text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("solicitadas")}
            >
              Coletas solicitadas
              {coletasSolicitadas.length > 0 && (
                <span className="ml-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {coletasSolicitadas.length}
                </span>
              )}
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "andamento"
                  ? "border-b-2 border-emerald-500 text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("andamento")}
            >
              Coletas em andamento
              {coletasAndamento.length > 0 && (
                <span className="ml-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {coletasAndamento.length}
                </span>
              )}
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "finalizadas"
                  ? "border-b-2 border-emerald-500 text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("finalizadas")}
            >
              Coletas finalizadas
              {coletasFinalizadas.length > 0 && (
                <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {coletasFinalizadas.length}
                </span>
              )}
            </button>
          </div>

          {/* Conteúdo da aba selecionada */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            {/* Coletas Solicitadas */}
            {activeTab === "solicitadas" && (
              <>
                <div className="p-4 border-b bg-gradient-to-r from-green-700 to-emerald-600 text-white">
                  <h2 className="text-lg font-semibold">Coletas solicitadas</h2>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                  {coletasSolicitadas.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center p-8">
                      Não há coletas solicitadas no momento
                    </p>
                  ) : (
                    <div className="space-y-3 p-3">
                      {coletasSolicitadas.map((coleta) => (
                        <div
                          key={coleta.id}
                          className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-emerald-700">
                              Coleta #{coleta.id}
                            </span>
                            <span className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                              Solicitado {coleta.data}
                            </span>
                          </div>
                          <div className="mb-3 text-sm">
                            <div className="flex items-start mb-1">
                              <span className="font-medium w-24 text-gray-600">
                                Solicitante:
                              </span>
                              <span className="text-gray-800">
                                {coleta.solicitante}
                              </span>
                            </div>
                            <div className="flex items-start mb-1">
                              <span className="font-medium w-24 text-gray-600">
                                Endereço:
                              </span>
                              <span className="flex-1 text-gray-800">
                                {coleta.endereco}
                              </span>
                            </div>
                            <div className="flex items-start">
                              <span className="font-medium w-24 text-gray-600">
                                Telefone:
                              </span>
                              <span className="text-gray-800">
                                {coleta.telefone}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-[#3C6499] hover:bg-[#375377] text-white border-none"
                              onClick={() => {
                                setSelectedColeta(coleta);
                                setDialogOpen(true);
                              }}
                            >
                              Mais detalhes
                            </Button>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-green-500 hover:bg-green-600 text-white border-none"
                                onClick={() => aceitarColeta(coleta)}
                              >
                                Aceitar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-500 hover:bg-red-600 text-white border-none"
                                onClick={() => rejeitarColeta(coleta)}
                              >
                                Rejeitar
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Coletas em Andamento */}
            {activeTab === "andamento" && (
              <>
                <div className="p-4 border-b bg-gradient-to-r from-green-700 to-emerald-600 text-white">
                  <h2 className="text-lg font-semibold">
                    Coletas em andamento
                  </h2>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                  {coletasAndamento.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center p-8">
                      Não há coletas em andamento no momento
                    </p>
                  ) : (
                    <div className="space-y-3 p-3">
                      {coletasAndamento.map((coleta) => (
                        <div key={coleta.id} className="">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-emerald-700">
                              Coleta #{coleta.id}
                            </span>
                            <span className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                              Previsão {coleta.previsao}
                            </span>
                          </div>
                          <div className="mb-3 text-sm">
                            <div className="flex items-start mb-1">
                              <span className="font-medium w-24 text-gray-600">
                                Solicitante:
                              </span>
                              <span className="text-gray-800">
                                {coleta.solicitante}
                              </span>
                            </div>
                            <div className="flex items-start mb-1">
                              <span className="font-medium w-24 text-gray-600">
                                Endereço:
                              </span>
                              <span className="flex-1 text-gray-800">
                                {coleta.endereco}
                              </span>
                            </div>
                            <div className="flex items-start">
                              <span className="font-medium w-24 text-gray-600">
                                Telefone:
                              </span>
                              <span className="text-gray-800">
                                {coleta.telefone}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-[#3C6499] hover:bg-[#375377] text-white border-none"
                              onClick={() => {
                                setSelectedColeta(coleta);
                                setDialogOpen(true);
                              }}
                            >
                              Mais detalhes
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-[#156d1c] hover:bg-[#17531c] hover:text-white text-white border-none"
                              onClick={() => finalizarColeta(coleta)}
                            >
                              Finalizar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Coletas Finalizadas */}
            {activeTab === "finalizadas" && (
              <>
                <div className="p-4 border-b bg-gradient-to-r from-green-700 to-emerald-600 text-white">
                  <h2 className="text-lg font-semibold">Coletas finalizadas</h2>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                  {coletasFinalizadas.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center p-8">
                      Não há coletas finalizadas
                    </p>
                  ) : (
                    <div className="space-y-3 p-3">
                      {coletasFinalizadas.map((coleta) => (
                        <div
                          key={coleta.id}
                          className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-green-700">
                              Coleta #{coleta.id}
                            </span>
                            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Finalizado {coleta.finalizada}
                            </span>
                          </div>
                          <div className="mb-3 text-sm">
                            <div className="flex items-start mb-1">
                              <span className="font-medium w-24 text-gray-600">
                                Solicitante:
                              </span>
                              <span className="text-gray-800">
                                {coleta.solicitante}
                              </span>
                            </div>
                            <div className="flex items-start mb-1">
                              <span className="font-medium w-24 text-gray-600">
                                Endereço:
                              </span>
                              <span className="flex-1 text-gray-800">
                                {coleta.endereco}
                              </span>
                            </div>
                            <div className="flex items-start">
                              <span className="font-medium w-24 text-gray-600">
                                Telefone:
                              </span>
                              <span className="text-gray-800">
                                {coleta.telefone}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-end items-center mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white border-none"
                              onClick={() => {
                                setSelectedColeta(coleta);
                                setDialogOpen(true);
                              }}
                            >
                              Mais detalhes
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Diálogo de detalhes */}
      <SimpleDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Detalhes da Coleta"
        footer={
          selectedColeta && "data" in selectedColeta ? (
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  aceitarColeta(selectedColeta as ColetaSolicitada);
                  setDialogOpen(false);
                }}
                className="bg-green-500 hover:bg-green-600 text-white border-none"
              >
                Aceitar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  rejeitarColeta(selectedColeta as ColetaSolicitada);
                  setDialogOpen(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white border-none"
              >
                Rejeitar
              </Button>
            </div>
          ) : selectedColeta && "previsao" in selectedColeta ? (
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  finalizarColeta(selectedColeta as ColetaAndamento);
                  setDialogOpen(false);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white border-none"
              >
                Finalizar
              </Button>
            </div>
          ) : null
        }
      >
        {selectedColeta && <DetalhesColeta dados={selectedColeta} />}
      </SimpleDialog>

 
    </div>
  );
}
