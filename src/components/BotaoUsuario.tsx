"use client"

import Link from "next/link"
import { signOut, useSession } from "@/lib/auth/client"
import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons"

export function UserButton() {
  const { data } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)

  // Faz o dropdown fechar quando clicar fora dele
  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setDropdownOpen(false)
    }
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Função para lidar com o logout
  const handleLogout = () => {
    signOut()
    setDropdownOpen(false)
  }

  // Verifica se tem sessão ativa
  if (!data) {
    return (
      <>
        <Link href="/login" className="hover:text-green-200 transition-colors">
          Entre
        </Link>
        <Link href="/cadastro" className="hover:text-green-200 transition-colors">
          Cadastrar
        </Link>
      </>
    )
  }

  // Se tiver sessão ativa, retorna isso
  return (
    <div className="relative hidden md:block">
      {/* botão dropdown */}
      {!menuOpen && (
        <button onClick={toggleDropdown} className="flex items-center hover:text-green-200 transition-colors">
          <span>Olá, {data.user.name}</span>
          <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
        </button>
      )}

      {/* Dropdown Menu */}
      {dropdownOpen && !menuOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg overflow-hidden z-50"
        >
          <Link
            href="/agendamentos"
            className="block w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors"
            onClick={() => setDropdownOpen(false)}
          >
            Meus agendamentos
          </Link>
          <Link
            href="/conta"
            className="block w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors"
            onClick={() => setDropdownOpen(false)}
          >
            Minha Conta
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors"
          >
            Sair
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div ref={menuRef} className="md:hidden flex flex-col space-y-2 mt-2">
          <Link href="/minha-conta" className="hover:opacity-80 px-4 py-2">
            Minha Conta
          </Link>
          <button
            onClick={() => {
              signOut()
              setMenuOpen(false) // Fecha o menu após sair
            }}
            className="hover:opacity-80 px-4 py-2 text-left"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  )
}

