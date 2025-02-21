"use client";
import Image from "next/image";
import Navbar from "./componentes/navbar";
import { FooterColeta } from "./componentes/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="bg-gradient-to-r from-[#3C6499] to-[#375377] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Seu eletrônico tem futuro.
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Descarte certo e ajude o planeta.
            </h2>
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
          <h2 className="text-4xl font-bold text-center mb-16">
            Como funciona?
          </h2>
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
                    Antes de solicitar uma coleta, os resíduos recicláveis
                    precisam ser higienizados e separados.
                  </p>
                </div>
              </div>
              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <h3 className="text-2xl font-bold mb-2">2. Agendamento</h3>
                  <p className="text-gray-600">
                    Após a separação, você pode agendar a coleta dos resíduos
                    recicláveis através do nosso site.
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
                    Nossa equipe irá até o local agendado para recolher os
                    resíduos recicláveis.
                  </p>
                </div>
              </div>
              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <h3 className="text-2xl font-bold mb-2">
                    4. Destinação Final
                  </h3>
                  <p className="text-gray-600">
                    Os resíduos recicláveis são encaminhados para a destinação
                    correta, evitando a poluição do meio ambiente.
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
              <h2 className="text-4xl md:text-5xl font-bold mb-10">
                Descarte consciente? Sim! Agende a coleta do seu lixo
                eletrônico.
              </h2>
              <button className="bg-white text-[#3C6499] px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors">
                Descartar agora
              </button>
            </div>
          </div>
        </div>
      </section>
      <section id="contato" className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">Contato</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block font-medium">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-2 bg-gray-200 rounded-md"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 bg-gray-200 rounded-md"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="block font-medium">
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full p-2 bg-gray-200 rounded-md"
                required
              />
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
      <section id="sobre-nos" className="bg-gray-100 py-16">
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
                Na E-Coleta, nos dedicamos à coleta e reciclagem de lixo
                eletrônico, promovendo práticas sustentáveis para reduzir o
                impacto ambiental. Fundada em 2024, nossa missão é garantir o
                descarte seguro de equipamentos eletrônicos, colaborando com
                comunidades e empresas para um futuro mais verde.
              </p>
            </div>
          </div>
        </div>
      </section>
      <FooterColeta />
    </div>
  );
}
