
import { CalendarClock, CheckCircle, Clock, Truck } from "lucide-react";


export default function PaginaAgendamentos (){
    const renderStatus = (status: string) => {
        switch (status) {
          case "aguardando":
            return (
              <div className="flex items-center gap-2 text-amber-600">
                <Clock className="h-5 w-5" />
                <span>Aguardando resposta da empresa</span>
              </div>
            )
          case "caminho":
            return (
              <div className="flex items-center gap-2 text-blue-600">
                <Truck className="h-5 w-5" />
                <span>Coletor a caminho</span>
              </div>
            )
          case "coletado":
            return (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>Itens coletados</span>
              </div>
            )
          default:
            return null
        }
      }
    const agendamentos = [
        {
          id: 1,
          data: "15/03/2025",
          horario: "14:00 - 16:00",
          endereco: "Rua das Flores, 123 - Jardim Primavera",
          itens: ["Computador", "Monitor", "Teclado"],
          status: "aguardando",
        },
        {
          id: 2,
          data: "20/03/2025",
          horario: "09:00 - 11:00",
          endereco: "Av. Principal, 456 - Centro",
          itens: ["Televisor", "DVD Player"],
          status: "caminho",
        },
        {
          id: 3,
          data: "10/03/2025",
          horario: "13:00 - 15:00",
          endereco: "Rua dos Ipês, 789 - Vila Nova",
          itens: ["Geladeira", "Microondas"],
          status: "coletado",
        },
      ]
    return (<main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-[#1a8e3e]">Meus Agendamentos</h1>
          <p className="text-gray-600">Acompanhe o status de todas as suas solicitações de coleta de lixo eletrônico</p>
        </div>

        {/* Lista de agendamentos */}
        <div className="grid gap-6">
          {agendamentos.map((agendamento) => (
            <div key={agendamento.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 bg-[#e0f5e0] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-5 w-5 text-[#1a8e3e]" />
                    <span className="font-medium">
                      Agendamento #{agendamento.id} - {agendamento.data} | {agendamento.horario}
                    </span>
                  </div>
                  {renderStatus(agendamento.status)}
                </div>
              </div>
              <div className="p-4">
                <div className="mb-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 font-medium text-[#1a8e3e]">Endereço</h3>
                    <p className="text-gray-700">{agendamento.endereco}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-medium text-[#1a8e3e]">Itens para coleta</h3>
                    <ul className="list-inside list-disc text-gray-700">
                      {agendamento.itens.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="rounded bg-[#1a8e3e] px-4 py-2 text-white hover:bg-[#157a33] focus:outline-none focus:ring-2 focus:ring-[#1a8e3e] focus:ring-offset-2">
                    Ver detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Seção de ajuda */}
        <div className="mt-8 rounded-lg bg-[#1a8e3e] p-6 text-white">
          <h2 className="mb-4 text-xl font-bold">Precisa de ajuda?</h2>
          <p className="mb-4">
            Nossa equipe está pronta para esclarecer suas dúvidas sobre o descarte de lixo eletrônico.
          </p>
          <div className="mb-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>(11) 9999-9999</span>
          </div>
          <button className="w-full rounded bg-white py-2 text-center font-medium text-[#1a8e3e] hover:bg-gray-100">
            Fale Conosco
          </button>
        </div>
      </main>)
}