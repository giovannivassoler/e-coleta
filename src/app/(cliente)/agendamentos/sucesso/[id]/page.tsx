import { db } from "@/lib/db/client";
import { ArrowLeft, Calendar, CheckCircle, Clock, MapPin } from 'lucide-react';
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SucessoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  // Buscar a coleta
  const coleta = await db.query.coletaTable.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!coleta) {
    redirect("/agendamentos");
  }

  // Buscar o endereço relacionado à coleta
  const endereco = await db.query.enderecoTable.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id_coleta, id);
    },
  });

  // Buscar os itens relacionados à coleta
  const itens = await db.query.itensTable.findMany({
    where(fields, operators) {
      return operators.eq(fields.id_coleta, id);
    },
  });

  // Formatar a data e hora
 // Formatar a data e hora
const dataColeta = new Date(coleta.data_coleta);
const dataFormatada = dataColeta.toLocaleDateString('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});
const horaFormatada = dataColeta.toLocaleTimeString('pt-BR', { 
  hour: '2-digit', 
  minute: '2-digit' 
});

  // Formatar o endereço completo
  const enderecoCompleto = endereco ? 
    `${endereco.endereco_usu}, ${endereco.num_end}${endereco.complemento_end ? `, ${endereco.complemento_end}` : ''} - ${endereco.bairro_end}, ${endereco.cidade_end} - ${endereco.estado_end}, ${endereco.cep_end}` : 
    "Endereço não encontrado";

  return (
    <main className="flex-grow bg-green-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl text-green-700 font-bold text-center mb-4">Pedido de coleta Realizado com Sucesso!</h1>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Seu agendamento para coleta de lixo eletrônico foi solicitado. Abaixo estão os detalhes da sua coleta.
        </p>

        {/* Success Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-green-100">
          <div className="bg-green-600 p-4 text-white flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Confirmação de Agendamento</h2>
          </div>

          <div className="p-6">
            {/* Confirmation Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Detalhes do Agendamento
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Número do pedido:</span> {coleta.id.substring(0, 8)}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {coleta.status_coleta}
                  </p>
                  <p>
                    <span className="font-medium">Data preferida:</span> {dataFormatada}
                  </p>
                  <p>
                    <span className="font-medium">Horário preferido:</span> {horaFormatada}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço de Coleta
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>{enderecoCompleto}</p>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="mb-6">
              <h3 className="font-semibold text-green-700 mb-3">Itens para Coleta</h3>
              <div className="bg-green-50 p-4 rounded-lg">
                {itens.length > 0 ? (
                  <ul className="space-y-2 text-gray-700">
                    {itens.map((item) => (
                      <li key={item.id} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {item.quantidade} {item.itens}
                        {item.observacao && (
                          <span className="text-sm text-gray-500 ml-2">
                            ({item.observacao})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Nenhum item encontrado para esta coleta.</p>
                )}
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Próximos Passos
              </h3>
              <ul className="space-y-2 text-gray-700 list-disc pl-5">
                <li>Você receberá um e-mail com os detalhes do agendamento</li>
                <li>Nossa equipe entrará em contato para confirmar o horário</li>
                <li>Prepare os itens conforme as instruções enviadas</li>
                <li>Esteja disponível no horário agendado para a coleta</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link
                href="/"
                className="bg-white border border-green-600 text-green-600 hover:bg-green-50 px-6 py-2 rounded-md flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para Início
              </Link>
              <Link
                href="/agendamentos"
                className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-md flex items-center justify-center"
              >
                Gerenciar Meus Agendamentos
              </Link>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="max-w-3xl mx-auto mt-8 bg-green-600 text-white rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-3">Precisa de ajuda?</h3>
          <p className="mb-4">
            Nossa equipe está pronta para esclarecer suas dúvidas sobre o descarte de lixo eletrônico.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>(11) 9999-9999</span>
            </div>
            <button className="bg-white text-green-600 hover:bg-green-50 px-6 py-2 rounded-md w-full sm:w-auto">
              Fale Conosco
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}