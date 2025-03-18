import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

export function HelpCard() {
  return (
    <div className="bg-green-600 text-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-2">Precisa de ajuda?</h3>
      <p className="mb-4 text-green-100">
        Nossa equipe está pronta para esclarecer suas dúvidas sobre o descarte de lixo eletrônico.
      </p>
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-5 w-5" />
        <span>(11) 9999-9999</span>
      </div>
      <Button variant="outline" className="w-full border-white text-black">
        Fale Conosco
      </Button>
    </div>
  )
}

