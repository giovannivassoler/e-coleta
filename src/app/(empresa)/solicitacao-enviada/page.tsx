import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Check, Mail } from "lucide-react";
import Link from "next/link";

export default function SolicitacaoEnviada (){
return (
    <main className="flex-1 container mx-auto py-8 px-4">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-emerald-700 mb-6">Solicitação Enviada com Sucesso!</h2>

      <Card className="p-8 bg-emerald-50 border-emerald-200">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-emerald-800">
            Obrigado pelo seu interesse em se tornar nosso parceiro!
          </h3>
        </div>

        <div className="space-y-4 text-emerald-800">
          <p className="text-center">
            Recebemos sua solicitação para se tornar um parceiro E-Coleta. Nossa equipe analisará suas informações e
            entrará em contato através do e-mail fornecido em breve.
          </p>

          <div className="flex items-center justify-center gap-2 text-emerald-700 bg-white p-4 rounded-lg border border-emerald-200">
            <Mail className="w-5 h-5" />
            <span>Fique atento à sua caixa de entrada!</span>
          </div>

          <p className="text-center text-sm">
            Caso não receba nosso e-mail em até 3 dias úteis, verifique sua pasta de spam ou entre em contato
            conosco.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Button>
        </div>
      </Card>

      <div className="mt-6 text-center text-sm text-emerald-600">
        <p>
          Tem alguma dúvida?{" "}
          <Link href="#" className="underline hover:text-emerald-800">
            Entre em contato
          </Link>
        </p>
      </div>
    </div>
  </main>
)
}
