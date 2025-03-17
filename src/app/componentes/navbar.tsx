"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { UserButton } from "./BotaoUsuario";
import { Recycle } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // const sobreNos = () => {
  //   const section = document.getElementById("sobre-nos");
  //   if (section) {
  //     section.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  // const contato = () => {
  //   const section = document.getElementById("contato");
  //   if (section) {
  //     section.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  return (
    // <nav className="bg-gradient-to-r from-[#3C6499] to-[#375377] text-white px-6 py-4">
    //   <div className="max-w-7xl mx-auto flex justify-between items-center">
    //     {/* Logo */}
    //     <div className="text-xl font-bold">
    //       <Image
    //         src="/imagens/logo-horizontal.png"
    //         alt="People recycling"
    //         width={250}
    //         height={250}
    //         className="object-contain"
    //       />
    //     </div>

    //     {/* Botão de menu mobile */}
    //     <button className="md:hidden" onClick={toggleMenu}>
    //       {menuOpen ? <X size={28} /> : <Menu size={28} />}
    //     </button>

    //     {/* Links da Navbar */}
    //     <div
    //       className={`md:flex md:space-x-6 ${
    //         menuOpen
    //           ? "flex flex-col absolute top-16 left-0 w-full bg-[#3C6499] py-4"
    //           : "hidden md:flex"
    //       }`}
    //     >
    //       <a href="/" className="hover:opacity-80 px-4 py-2">
    //         Home
    //       </a>
    //       <a href="/agendar-coleta" className="hover:opacity-80 px-4 py-2">
    //         Agendar Coleta
    //       </a>
    //       <a href="/dicas" className="hover:opacity-80 px-4 py-2">
    //         Dicas
    //       </a>
    //       <UserButton />
    //     </div>
    //   </div>
    // </nav>

    <header className="bg-gradient-to-r from-green-700 to-emerald-600 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Recycle className="h-8 w-8" />
          <h1 className="text-2xl font-bold">E-Coleta</h1>
        </div>
        {/* Botão de menu mobile */}
        <button className="md:hidden" onClick={toggleMenu}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <nav className="hidden md:flex gap-6">
          <a href="/" className="hover:text-green-200 transition-colors">
            Início
          </a>
          <a
            href="/agendar-coleta"
            className="hover:text-green-200 transition-colors"
          >
            Agendar Coleta
          </a>
          <a href="/dicas" className="hover:text-green-200 transition-colors">
            Dicas
          </a>
          <a
            href="/parceiro"
            className="hover:text-green-200 transition-colors"
          >
            Quero ser um parceiro
          </a>
          <UserButton />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
