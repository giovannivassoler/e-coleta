import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, MapPin, Clock } from "lucide-react"

export function BenefitsCard() {
  return (
    <Card className="border-green-100 shadow-md">
      <CardHeader className="bg-green-50 border-b border-green-100">
        <CardTitle className="text-xl font-bold text-green-800">Benefícios</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <div className="p-1 mt-0.5 rounded-full bg-green-100 text-green-600">
              <Recycle className="h-4 w-4" />
            </div>
            <div>
              <span className="font-medium text-green-800">Descarte Responsável</span>
              <p className="text-sm text-gray-600">Garantimos o descarte correto de seus equipamentos eletrônicos.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <div className="p-1 mt-0.5 rounded-full bg-green-100 text-green-600">
              <Recycle className="h-4 w-4" />
            </div>
            <div>
              <span className="font-medium text-green-800">Redução de Poluição</span>
              <p className="text-sm text-gray-600">Evite que materiais tóxicos contaminem o meio ambiente.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <div className="p-1 mt-0.5 rounded-full bg-green-100 text-green-600">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <span className="font-medium text-green-800">Praticidade</span>
              <p className="text-sm text-gray-600">A coleta é feita em sua própria casa</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <div className="p-1 mt-0.5 rounded-full bg-green-100 text-green-600">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <span className="font-medium text-green-800">Economia de Tempo</span>
              <p className="text-sm text-gray-600">Não perca tempo procurando pontos de coleta.</p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

