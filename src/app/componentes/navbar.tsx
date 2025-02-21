"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { UserButton } from "./BotaoUsuario";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const sobreNos = () => {
    const section = document.getElementById("sobre-nos");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const contato = () => {
    const section = document.getElementById("contato");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#3C6499] to-[#375377] text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Image
            src="/imagens/logo-horizontal.png"
            alt="People recycling"
            width={250}
            height={250}
            className="object-contain"
          />
        </div>

        {/* Botão de menu mobile */}
        <button className="md:hidden" onClick={toggleMenu}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Links da Navbar */}
        <div
          className={`md:flex md:space-x-6 ${
            menuOpen
              ? "flex flex-col absolute top-16 left-0 w-full bg-[#3C6499] py-4"
              : "hidden md:flex"
          }`}
        >
          <Link href="/" className="hover:opacity-80 px-4 py-2">
            Home
          </Link>
          <Link href="/agendamento" className="hover:opacity-80 px-4 py-2">
            Agendar Coleta
          </Link>
          <Link href="/dicas" className="hover:opacity-80 px-4 py-2">
            Dicas
          </Link>
          <Link
            href="#sobre-nos"
            onClick={sobreNos}
            className="hover:opacity-80 px-4 py-2"
          >
            Sobre nós
          </Link>
          <Link
            href="#contato"
            onClick={contato}
            className="hover:opacity-80 px-4 py-2"
          >
            Contato
          </Link>
          <UserButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
