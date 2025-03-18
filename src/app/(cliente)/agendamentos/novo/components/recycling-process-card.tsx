import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RecyclingProcessCard() {
  return (
    <Card className="border-green-100 shadow-md">
      <CardHeader className="bg-green-50 border-b border-green-100">
        <CardTitle className="text-xl font-bold text-green-800">Processo de Reciclagem</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="relative pl-8 pb-4 border-l-2 border-green-200">
            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
            <h4 className="font-medium text-green-800">1. Coleta</h4>
            <p className="text-sm text-gray-600">
              Agendamos a coleta dos seus equipamentos eletrônicos de forma prática e segura.
            </p>
          </div>
          <div className="relative pl-8 pb-4 border-l-2 border-green-200">
            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
            <h4 className="font-medium text-green-800">2. Triagem</h4>
            <p className="text-sm text-gray-600">
              Realizamos a separação cuidadosa dos materiais por tipo e avaliamos se ainda podem ser reutilizados.
            </p>
          </div>
          <div className="relative pl-8 pb-4 border-l-2 border-green-200">
            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
            <h4 className="font-medium text-green-800">3. Desmontagem</h4>
            <p className="text-sm text-gray-600">
              Equipamentos que não podem ser reaproveitados são desmontados para que seus componentes possam ser
              separados de maneira eficiente.
            </p>
          </div>
          <div className="relative pl-8">
            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
            <h4 className="font-medium text-green-800">4. Reciclagem</h4>
            <p className="text-sm text-gray-600">
              Após a separação dos componentes, eles são enviados para processos de reciclagem, garantindo a destinação
              correta e sustentável.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

