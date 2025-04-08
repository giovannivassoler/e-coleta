import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, MapPin, Clock, Smartphone, Laptop, Battery, Monitor, ArrowRight, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">

      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto py-16 px-4 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800">
                Plataforma de Agendamento
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-green-800">
                Conectamos você às melhores empresas de coleta
              </h1>
              <p className="text-lg text-gray-600 max-w-xl">
                Facilitamos o descarte responsável do seu lixo eletrônico conectando você às empresas especializadas em
                coleta e reciclagem na sua região.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/agendamentos/novo">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg h-auto">
                    Agendar Coleta
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-6 text-lg h-auto"
                >
                  Como Funciona
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/imagens/img-coleta.jpg"
                alt="Reciclagem de eletrônicos"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 -mt-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-xl shadow-lg border border-green-100 p-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">+5</p>
              <p className="text-gray-600">Empresas Parceiras</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">15 ton</p>
              <p className="text-gray-600">Lixo Eletrônico Intermediado</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">100%</p>
              <p className="text-gray-600">Parceiros Certificados</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Como Funciona</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nossa plataforma conecta você às empresas especializadas em coleta de lixo eletrônico, tornando o processo
              simples, rápido e eficiente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <CardTitle className="text-xl font-bold text-green-800">Agende Online</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600">
                  Preencha o formulário online com seus dados, endereço e informações sobre os itens que deseja
                  descartar.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <CardTitle className="text-xl font-bold text-green-800">Conectamos Você</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600">
                  Nossa plataforma encontra a empresa parceira ideal na sua região para realizar a coleta dos seus
                  equipamentos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <CardTitle className="text-xl font-bold text-green-800">Coleta e Reciclagem</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600">
                  A empresa parceira realiza a coleta na data agendada e garante o descarte correto dos seus
                  equipamentos eletrônicos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Items We Collect */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-4">O Que Pode Ser Coletado</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nossas empresas parceiras aceitam diversos tipos de equipamentos eletrônicos para reciclagem. Confira
              abaixo os principais itens aceitos para coleta.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 flex flex-col items-center text-center">
              <div className="p-4 rounded-full bg-green-100 text-green-600 mb-4">
                <Smartphone className="h-8 w-8" />
              </div>
              <h3 className="font-medium text-green-800">Celulares</h3>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 flex flex-col items-center text-center">
              <div className="p-4 rounded-full bg-green-100 text-green-600 mb-4">
                <Laptop className="h-8 w-8" />
              </div>
              <h3 className="font-medium text-green-800">Computadores</h3>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 flex flex-col items-center text-center">
              <div className="p-4 rounded-full bg-green-100 text-green-600 mb-4">
                <Monitor className="h-8 w-8" />
              </div>
              <h3 className="font-medium text-green-800">Monitores</h3>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 flex flex-col items-center text-center">
              <div className="p-4 rounded-full bg-green-100 text-green-600 mb-4">
                <Battery className="h-8 w-8" />
              </div>
              <h3 className="font-medium text-green-800">Pilhas e Baterias</h3>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 flex flex-col items-center text-center">
              <div className="p-4 rounded-full bg-green-100 text-green-600 mb-4">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 7H4C2.89543 7 2 7.89543 2 9V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V9C22 7.89543 21.1046 7 20 7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 3L12 7L7 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-green-800">Televisores</h3>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 flex flex-col items-center text-center">
              <div className="p-4 rounded-full bg-green-100 text-green-600 mb-4">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M6 9H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M6 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M6 15H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="font-medium text-green-800">Eletrodomésticos</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 w-fit mb-4">
                    <Recycle className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-green-800 mb-2">Empresas Certificadas</h3>
                  <p className="text-gray-600">
                    Trabalhamos apenas com empresas que seguem as normas ambientais para descarte correto.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 w-fit mb-4">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-green-800 mb-2">Redução de Poluição</h3>
                  <p className="text-gray-600">Ajudamos a evitar que materiais tóxicos contaminem o meio ambiente.</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 w-fit mb-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-green-800 mb-2">Praticidade</h3>
                  <p className="text-gray-600">
                    Encontramos a melhor empresa de coleta na sua região com apenas alguns cliques.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 w-fit mb-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-green-800 mb-2">Economia de Tempo</h3>
                  <p className="text-gray-600">Não perca tempo procurando empresas de coleta ou pontos de descarte.</p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl font-bold text-green-800">Benefícios da Nossa Plataforma</h2>
              <p className="text-gray-600">
                Nossa plataforma conecta você às melhores empresas de coleta de lixo eletrônico, facilitando o descarte
                responsável e contribuindo para um planeta mais sustentável.
              </p>
              <p className="text-gray-600">
                Trabalhamos apenas com parceiros certificados que garantem que cada componente seja tratado de acordo
                com as melhores práticas ambientais, minimizando o impacto no meio ambiente.
              </p><br></br>
              <Link href="/agendamentos/novo">
                <Button className="bg-green-600 hover:bg-green-700 text-white">Agendar Coleta Agora</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section - NOVA SEÇÃO */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Nossas Empresas Parceiras</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trabalhamos com as melhores empresas de coleta e reciclagem de lixo eletrônico, garantindo um serviço de
              qualidade e ambientalmente responsável.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Aqui você pode adicionar logos das empresas parceiras */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 flex items-center justify-center h-32">
              <Image
                src="/imagens/empresa-parceira.png"
                alt="Logo Parceiro 1"
                width={160}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 flex items-center justify-center h-32">
              <Image
                src="/imagens/empresa-parceira.png"
                alt="Logo Parceiro 2"
                width={160}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 flex items-center justify-center h-32">
              <Image
                src="/imagens/empresa-parceira.png"
                alt="Logo Parceiro 3"
                width={160}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 flex items-center justify-center h-32">
              <Image
                src="/imagens/empresa-parceira.png"
                alt="Logo Parceiro 4"
                width={160}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para fazer a diferença?</h2>
          <p className="text-green-100 max-w-2xl mx-auto mb-8">
            Agende agora mesmo a coleta do seu lixo eletrônico através da nossa plataforma e contribua para um futuro
            mais sustentável. É rápido, fácil e você estará fazendo a sua parte pelo meio ambiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/agendamentos/novo">
              <Button className="bg-white text-green-700 hover:bg-green-50 px-8 py-6 text-lg h-auto">
                Agendar Coleta
              </Button>
            </Link>
            <Button variant="outline" className="border-white text-green-700 px-8 py-6 text-lg h-auto">
              Fale Conosco
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-4">O Que Nossos Usuários Dizem</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Confira os depoimentos de quem já utilizou nossa plataforma para agendar a coleta de lixo eletrônico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-green-100 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                    <span className="text-xl font-bold">M</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-800">Marcos Silva</h4>
                    <p className="text-sm text-gray-500">São Paulo, SP</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  Plataforma excelente! Agendei pela internet, a empresa parceira chegou no horário marcado e levou
                  todos os equipamentos que eu não usava mais. Muito prático!
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                    <span className="text-xl font-bold">C</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-800">Carla Mendes</h4>
                    <p className="text-sm text-gray-500">Rio de Janeiro, RJ</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  Estava com vários eletrônicos antigos em casa e não sabia como descartar. Esta plataforma me conectou
                  com uma empresa de coleta na minha região. Solução perfeita!
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                    <span className="text-xl font-bold">R</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-800">Roberto Almeida</h4>
                    <p className="text-sm text-gray-500">Belo Horizonte, MG</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  Como empresa, precisávamos de uma solução para descartar equipamentos de TI antigos. A plataforma nos
                  conectou com um parceiro especializado que nos forneceu certificado de descarte.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    
    </div>
  )
}

