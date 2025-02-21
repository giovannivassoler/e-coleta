"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Calendar, List, Lock, User, Menu } from "lucide-react";
import { MinhasColetas } from "./componentes/MinhasColetas";
import { AlterarSenha } from "./componentes/AlterarSenha";
import { InfoPessoal } from "./componentes/InfoPessoal";

const sidebarItems = [
  { icon: Home, label: "Home", id: "home", href: "/" },
  {
    icon: Calendar,
    label: "Agendar Coleta",
    id: "agendar-coleta",
    href: "/agendar-coleta",
  },
  { icon: List, label: "Minhas Coletas", id: "minhas-coletas" },
  { icon: Lock, label: "Alterar Senha", id: "alterar-senha" },
  { icon: User, label: "Informações Pessoais", id: "informacoes-pessoais" },
];

export default function MinhaContaPage() {
  const [activeSection, setActiveSection] = useState("informacoes-pessoais");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case "minhas-coletas":
        return <MinhasColetas />;
      case "alterar-senha":
        return <AlterarSenha />;
      case "informacoes-pessoais":
        return <InfoPessoal />;
      default:
        return <div>Selecione uma opção</div>;
    }
  };

  const Sidebar = ({ className = "" }) => (
    <aside
      className={`bg-gradient-to-r from-[#3C6499] to-[#375377] p-4 ${className}`}
    >
      <h2 className="text-xl font-bold mb-4">Minha Conta</h2>
      <nav>
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.id} className="mb-2">
              {item.href ? (
                <Link
                  href={item.href}
                  className={`flex items-center w-full p-2 rounded hover:bg-[#f8f8f88c] transition duration-300 ease-in-out`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full p-2 rounded ${
                    activeSection === item.id
                      ? "bg-[#fff] text-black"
                      : "hover:bg-[#f8f8f88c] transition duration-300 ease-in-out"
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Sidebar Desktop */}
      <Sidebar className="hidden md:block w-64" />

      {/* Botão menu celular */}
      <button
        className="md:hidden p-4 focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar Celular */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex justify-end p-4">
            <button
              className="focus:outline-none"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">
          {sidebarItems.find((item) => item.id === activeSection)?.label}
        </h1>
        {renderContent()}
      </main>
    </div>
  );
}
