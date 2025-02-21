"use client";

import { signOut, useSession } from "@/lib/auth/client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

export function UserButton() {
  const { data } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Faz o dropdown fechar quando clicar fora dele
  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setDropdownOpen(false);
    }
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Verifica se tem sessão ativa
  if (!data) {
    return (
      <Link href="/login" className="hover:opacity-80">
        Login
      </Link>
    );
  }

  // Se tiver sessão ativa, retorna isso
  return (
    <div className="relative hidden md:block">
      {/* botão dropdown */}
      {!menuOpen && (
        <button
          onClick={toggleDropdown}
          className="hover:opacity-80 px-4 py-2 flex items-center gap-1"
        >
          Olá, {data.user.name} <FontAwesomeIcon icon={faAngleDown} />
        </button>
      )}

      {/* Dropdown Menu */}
      {dropdownOpen && !menuOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-lg overflow-hidden"
        >
          <Link href="/Conta" className="block px-4 py-2 hover:bg-gray-200">
            Minha Conta
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full text-left px-4 py-2 hover:bg-gray-200"
          >
            Sair
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div ref={menuRef} className="md:hidden flex flex-col space-y-2 mt-2">
          <Link href="/minhaconta" className="hover:opacity-80 px-4 py-2">
            Minha Conta
          </Link>
          <button
            onClick={() => {
              signOut();
              setMenuOpen(false); // Fecha o menu após sair
            }}
            className="hover:opacity-80 px-4 py-2 text-left"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
