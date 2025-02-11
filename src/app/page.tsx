import Image from "next/image"
import Link from "next/link"

export default function Home() {
  
  return (
    <div className="min-h-screen">
      <nav className="bg-gradient-to-r from-[#3C6499] to-[#375377] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold"><Image
                      src="/imagens/logo-horizontal.png"
                      alt="People recycling"
                      width={250}
                      height={250}
                      className="object-contain"
                    /></div>
          <div className="hidden md:flex space-x-6">
            <Link href="#" className="hover:opacity-80">
              Home
            </Link>
            <Link href="#" className="hover:opacity-80">
              Agendar Coleta
            </Link>
            <Link href="#" className="hover:opacity-80">
              Dicas
            </Link>
            <Link href="#" className="hover:opacity-80">
              Sobre nós
            </Link>
            <Link href="#" className="hover:opacity-80">
              Contato
            </Link>
            <Link href="/login" className="hover:opacity-80">
              Login
            </Link>
          </div>
        </div>
      </nav>
      <section className="bg-gradient-to-r from-[#3C6499] to-[#375377] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Seu eletrônico tem futuro.</h1>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Descarte certo e ajude o planeta.</h2>
            <button className="bg-white text-[#1e3a8a] px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors">
              Descartar agora
            </button>
          </div>
          <div className="flex justify-center">
            <Image
              src="/imagens/img-home.png"
              alt="Recycling bin with electronic devices"
              width={700}
              height={700}
              className="object-contain"
            />
          </div>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Como funciona?</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#1e3a8a]" />
            <div className="space-y-24">
              <div className="relative flex items-center">
                <div className="flex w-1/2 justify-end pr-8">
                  <div>
                    <Image
                      src="/imagens/img-separacao.png"
                      alt="People recycling"
                      width={250}
                      height={250}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#1e3a8a] rounded-full" />
                <div className="w-1/2 pl-8">
                  <h3 className="text-2xl font-bold mb-2">1. Separação</h3>
                  <p className="text-gray-600">
                    Antes de solicitar uma coleta, os resíduos recicláveis precisam ser higienizados e separados.
                  </p>
                </div>
              </div>
              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <h3 className="text-2xl font-bold mb-2">2. Agendamento</h3>
                  <p className="text-gray-600">
                    Após a separação, você pode agendar a coleta dos resíduos recicláveis através do nosso site.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#1e3a8a] rounded-full" />
                <div className="flex w-1/2 pl-8">
                  <Image
                    src="/imagens/img-agendamento.png"
                    alt="Person explaining"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="relative flex items-center">
                <div className="flex w-1/2 justify-end pr-8">
                  <Image
                    src="/imagens/img-coleta.png"
                    alt="Delivery truck"
                    width={250}
                    height={250}
                    className="object-contain"
                  />
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#1e3a8a] rounded-full" />
                <div className="w-1/2 pl-8">
                  <h3 className="text-2xl font-bold mb-2">3. Coleta</h3>
                  <p className="text-gray-600">
                    Nossa equipe irá até o local agendado para recolher os resíduos recicláveis.
                  </p>
                </div>
              </div>
              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <h3 className="text-2xl font-bold mb-2">4. Destinação Final</h3>
                  <p className="text-gray-600">
                    Os resíduos recicláveis são encaminhados para a destinação correta, evitando a poluição do meio ambiente.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#1e3a8a] rounded-full" />
                <div className="flex w-1/2 pl-8">
                  <Image
                    src="/imagens/img-destinacao.png"
                    alt="People around globe"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden bg-gradient-to-r from-[#3C6499] to-[#375377]">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src="/imagens/img-descarte.png"
                alt="Delivery van with person"
                width={500}
                height={600}
                className="object-contain"
              />
            </div>
            <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-10">Descarte consciente? Sim! Agende a coleta do seu lixo eletrônico.</h2>
              <button className="bg-white text-[#3C6499] px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors">
                Descartar agora
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">Contato</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block font-medium">
                  Nome
                </label>
                <input type="text" id="name" name="name" className="w-full p-2 bg-gray-200 rounded-md" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block font-medium">
                  Email
                </label>
                <input type="email" id="email" name="email" className="w-full p-2 bg-gray-200 rounded-md" required />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="block font-medium">
                Mensagem
              </label>
              <textarea id="message" name="message" rows={6} className="w-full p-2 bg-gray-200 rounded-md" required />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </section>
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="w-80 h-80 flex items-center justify-center">
              <div>
              <Image
                src="/imagens/logo-colorida.png"
                alt="Delivery van with person"
                width={800}
                height={800}
                className="object-contain"
              />
            </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6">Sobre nós</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Na E-Coleta, nos dedicamos à coleta e reciclagem de lixo eletrônico, promovendo práticas sustentáveis
                para reduzir o impacto ambiental. Fundada em 2024, nossa missão é garantir o descarte seguro de
                equipamentos eletrônicos, colaborando com comunidades e empresas para um futuro mais verde.
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gradient-to-r from-[#3C6499] to-[#375377] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
            <Image
                      src="/imagens/logo-full-branco.png"
                      alt="People recycling"
                      width={250}
                      height={250}
                      className="object-contain"
                    />
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Agendar Coleta
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Dicas
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Sobre nós
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <ul className="space-y-2">
                <li>contato@e-coleta.com</li>
                <li>(11) 1234-5678</li>
                <li>Rua da Reciclagem, 123</li>
                <li>São Paulo, SP</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Siga-nos</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:opacity-80">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="hover:opacity-80">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
                  </svg>
                </a>
                <a href="#" className="hover:opacity-80">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-blue-400 text-center">
            <p>&copy; 2025 E-Coleta. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

