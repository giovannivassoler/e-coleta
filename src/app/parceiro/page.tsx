import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, Award, Calendar, Shield, ArrowRight } from "lucide-react"
import Navbar from "../componentes/navbar"
import { FooterColeta } from "../componentes/footer"

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto py-16 px-4 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800">
                Parceria Estratégica
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-green-800">
                Torne-se um Parceiro e Expanda seus Negócios
              </h1>
              <p className="text-lg text-gray-600 max-w-xl">
                Junte-se à nossa plataforma e conecte-se com clientes que precisam dos seus serviços de coleta de lixo
                eletrônico.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#form-parceiro">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg h-auto">
                    Quero ser Parceiro
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/imagens/img-coleta.jpg"
                alt="Parceria de negócios"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Por que se tornar nosso parceiro?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nossa plataforma conecta sua empresa diretamente a clientes que precisam dos seus serviços de coleta de
              lixo eletrônico, oferecendo diversas vantagens para o crescimento do seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="p-4 rounded-full bg-green-100 text-green-600 w-fit mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold text-green-800">Aumento de Clientes</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600">
                  Acesse uma base crescente de clientes que buscam serviços de coleta de lixo eletrônico. Nossa
                  plataforma direciona clientes qualificados diretamente para você.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="p-4 rounded-full bg-green-100 text-green-600 w-fit mb-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold text-green-800">Crescimento de Receita</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600">
                  Aumente seu volume de coletas e, consequentemente, sua receita. Nossos parceiros relatam um aumento
                  médio de 30% no volume de negócios após se juntarem à plataforma.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="p-4 rounded-full bg-green-100 text-green-600 w-fit mb-4">
                  <Award className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold text-green-800">Credibilidade</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600">
                  Ganhe visibilidade e
                  credibilidade como uma empresa comprometida com a sustentabilidade.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works For Partners */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Como Funciona para Parceiros</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Entenda como nossa plataforma conecta sua empresa aos clientes e facilita todo o processo de coleta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <CardTitle className="text-xl font-bold text-green-800">Cadastro</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600">
                  Preencha o formulário de parceria com os dados da sua empresa
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <CardTitle className="text-xl font-bold text-green-800">Verificação</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600">
                  Nossa equipe verifica suas credenciais e certificações para garantir que você atende aos nossos
                  padrões de qualidade.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <CardTitle className="text-xl font-bold text-green-800">Integração</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600">
                  Após aprovação, sua empresa é integrada à nossa plataforma e começa a receber solicitações de coleta
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white mb-4">
                  <span className="text-xl font-bold">4</span>
                </div>
                <CardTitle className="text-xl font-bold text-green-800">Crescimento</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600">
                  Gerencie suas coletas e expanda seus negócios com nossa plataforma.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits in Detail */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 w-fit mb-4">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-green-800 mb-2">Agendamento Flexível</h3>
                  <p className="text-gray-600">
                    Gerencie sua agenda e disponibilidade, aceitando coletas nos horários que funcionam para você.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 w-fit mb-4">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-green-800 mb-2">Suporte Dedicado</h3>
                  <p className="text-gray-600">
                    Conte com nossa equipe de suporte para ajudar em qualquer questão relacionada à plataforma.
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl font-bold text-green-800">Benefícios Exclusivos para Parceiros</h2>
              <p className="text-gray-600">
                Nossa plataforma foi desenvolvida pensando nas necessidades das empresas de coleta de lixo eletrônico,
                oferecendo ferramentas e recursos que facilitam a gestão do seu negócio.
              </p>
              <p className="text-gray-600">
                Além de conectar você a novos clientes, oferecemos um painel administrativo completo para gerenciar suas
                coletas, acompanhar seu desempenho e expandir sua operação.
              </p>
              <div className="pt-4">
                <Link href="#form-parceiro">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">Torne-se um Parceiro Agora</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials from Partners */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-4">O Que Nossos Parceiros Dizem</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Confira os depoimentos de empresas que já fazem parte da nossa rede de parceiros.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-green-100 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                    <span className="text-xl font-bold">E</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-800">Empresa Parceira</h4>
                    <p className="text-sm text-gray-500">São Paulo, SP</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Desde que nos tornamos parceiros, aumentamos nosso volume de coletas em 40%. A plataforma é intuitiva
                  e nos conecta com clientes qualificados que realmente precisam dos nossos serviços."
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
                    <h4 className="font-bold text-green-800">Empresa Parceira</h4>
                    <p className="text-sm text-gray-500">Rio de Janeiro, RJ</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "A parceria com a plataforma nos permitiu expandir nossa área de atuação e otimizar nossas rotas de
                  coleta. O sistema de agendamento é eficiente e o suporte é excelente."
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                    <span className="text-xl font-bold">T</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-800">Empresa Parceira</h4>
                    <p className="text-sm text-gray-500">Belo Horizonte, MG</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Como uma empresa de pequeno porte, a plataforma nos deu visibilidade e credibilidade no mercado.
                  Hoje, temos uma agenda cheia de coletas e estamos expandindo nossa equipe."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partner Form */}
      <section id="form-parceiro" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-green-800 mb-4">Torne-se um Parceiro</h2>
              <p className="text-gray-600">
                Preencha o formulário abaixo para iniciar o processo de parceria. Nossa equipe entrará em contato para
                fornecer mais informações e finalizar seu cadastro.
              </p>
            </div>

            <Card className="border-green-100 shadow-lg">
              <CardContent className="pt-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="company-name" className="text-sm font-medium text-gray-700">
                        Nome da Empresa
                      </label>
                      <input
                        id="company-name"
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nome da sua empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="cnpj" className="text-sm font-medium text-gray-700">
                        CNPJ
                      </label>
                      <input
                        id="cnpj"
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="XX.XXX.XXX/XXXX-XX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="text-sm font-medium text-gray-700">
                        Nome do Responsável
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Telefone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="(XX) XXXXX-XXXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      E-mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="contato@suaempresa.com.br"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="regions" className="text-sm font-medium text-gray-700">
                      Regiões de Atuação
                    </label>
                    <input
                      id="regions"
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: São Paulo - Capital, Grande São Paulo, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="materials" className="text-sm font-medium text-gray-700">
                      Tipos de Materiais Coletados
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span>Computadores</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span>Celulares</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span>Monitores</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span>Pilhas e Baterias</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span>Televisores</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span>Eletrodomésticos</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Informações Adicionais
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Conte-nos mais sobre sua empresa e serviços..."
                    ></textarea>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input id="terms" type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      Concordo com os{" "}
                      <Link href="#" className="text-green-600 hover:underline">
                        Termos e Condições
                      </Link>{" "}
                      e{" "}
                      <Link href="#" className="text-green-600 hover:underline">
                        Política de Privacidade
                      </Link>
                    </label>
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg h-auto">
                    Enviar Solicitação de Parceria
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <FooterColeta />
    </div>
  )
}

