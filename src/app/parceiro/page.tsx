"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Navbar from "../componentes/navbar";
import { FooterColeta } from "../componentes/footer";

const beneficios = [
  {
    number: 1,
    title: "Amplie seu impacto ambiental",
    description:
      "Torne-se parte de uma rede dedicada à reciclagem responsável de eletrônicos.",
  },
  {
    number: 2,
    title: "Acesso a uma ampla base de clientes",
    description:
      "Conecte-se com usuários que buscam soluções para o descarte correto de eletrônicos.",
  },
  {
    number: 3,
    title: "Gestão simplificada",
    description:
      "Use nossa plataforma para gerenciar coletas e agendamentos de forma eficiente.",
  },
  {
    number: 4,
    title: "Visibilidade e reconhecimento",
    description:
      "Destaque-se como uma empresa comprometida com a sustentabilidade e responsabilidade ambiental.",
  },
];

export default function QueroSerParceiroPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar></Navbar>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Torne-se um Parceiro E-COLETA
            </h1>
            <h2 className="text-2xl text-gray-600">
              Junte-se à revolução da reciclagem eletrônica
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {beneficios.map((beneficio) => (
              <Card
                key={beneficio.number}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                      {beneficio.number}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {beneficio.title}
                    </h3>
                    <p className="text-gray-600">{beneficio.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => router.push("/cadastroEmpresa")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Cadastre sua empresa agora
            </Button>
          </div>
        </div>
      </main>

      <FooterColeta></FooterColeta>
    </div>
  );
}
