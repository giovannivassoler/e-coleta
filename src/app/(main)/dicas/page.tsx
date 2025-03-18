import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, MapPin, Gift, Shield, ArrowRight, Info } from "lucide-react"


export default function TipsGuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
    

      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto py-16 px-4 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800">
                Descarte Responsável
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-green-800">
                Dicas e Orientações para Descarte
              </h1>
              <p className="text-lg text-gray-600 max-w-xl">
                Saiba como descartar corretamente seus equipamentos eletrônicos e contribuir para um planeta mais
                sustentável.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/agendar-coleta">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg h-auto">
                    Agendar Coleta
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/imagens/img-coleta.jpg"
                alt="Descarte responsável de eletrônicos"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Dicas para Descarte Responsável</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Siga estas orientações para garantir que seus equipamentos eletrônicos sejam descartados de forma segura e
              ambientalmente responsável.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-green-100 shadow-md overflow-hidden">
              <div className="h-2 bg-green-600 w-full"></div>
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <Trash2 className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-green-800">Não jogue em lixo comum</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600">
                  Equipamentos eletrônicos contêm materiais tóxicos que podem contaminar o solo e a água. Sempre
                  descarte em locais apropriados.
                </p>
                <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-700">
                      Materiais como chumbo, mercúrio e cádmio presentes em eletrônicos são altamente tóxicos e podem
                      causar sérios danos ambientais quando descartados incorretamente.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md overflow-hidden">
              <div className="h-2 bg-green-600 w-full"></div>
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-green-800">Procure pontos de coleta</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600">
                  Antes de solicitar uma coleta, os resíduos recicláveis precisam ser higienizados e separados.
                </p>
                <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-700">
                      Muitas cidades possuem pontos de coleta específicos para lixo eletrônico. Nossa plataforma pode
                      ajudar você a encontrar o ponto mais próximo da sua localização.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md overflow-hidden">
              <div className="h-2 bg-green-600 w-full"></div>
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <Gift className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-green-800">Doe</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600">
                  Muitas cidades têm pontos de coleta específicos para lixo eletrônico. Verifique com a prefeitura ou
                  empresas de reciclagem locais.
                </p>
                <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-700">
                      Se seus equipamentos ainda funcionam, considere doá-los para instituições de caridade, escolas ou
                      projetos sociais que possam dar uma nova vida a eles.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md overflow-hidden">
              <div className="h-2 bg-green-600 w-full"></div>
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <Shield className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-green-800">Apague seus dados</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600">
                  Antes de descartar qualquer dispositivo, certifique-se de apagar todos os dados pessoais para proteger
                  sua privacidade.
                </p>
                <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-700">
                      Realize uma restauração de fábrica em seus dispositivos ou utilize softwares específicos para
                      apagar permanentemente seus dados pessoais antes do descarte.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-green-800">Por que o descarte correto é importante?</h2>
              <p className="text-gray-600">
                O lixo eletrônico é um dos resíduos que mais cresce no mundo. Quando descartado incorretamente, pode
                causar sérios danos ao meio ambiente e à saúde pública.
              </p>
              <p className="text-gray-600">
                Ao descartar seus equipamentos eletrônicos de forma responsável, você contribui para:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-green-600 p-1 mt-1">
                    <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                  </div>
                  <span className="text-gray-600">Redução da poluição do solo e da água</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-green-600 p-1 mt-1">
                    <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                  </div>
                  <span className="text-gray-600">Economia de recursos naturais através da reciclagem</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-green-600 p-1 mt-1">
                    <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                  </div>
                  <span className="text-gray-600">Proteção da saúde pública</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-green-600 p-1 mt-1">
                    <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                  </div>
                  <span className="text-gray-600">Cumprimento da legislação ambiental</span>
                </li>
              </ul>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/imagens/img-coleta.jpg"
                alt="Impacto ambiental do lixo eletrônico"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
 
    </div>
  )
}

