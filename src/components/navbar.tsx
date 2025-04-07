"use client"

import { useState, useEffect } from "react"
import { Menu, X, Recycle, Loader2 } from "lucide-react"
import { UserButton } from "./BotaoUsuario"
import Link from "next/link"
import { useSession } from "@/lib/auth/client"
import { checkUserCompany } from "./actions"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session, isPending } = useSession()
  const [hasCompany, setHasCompany] = useState(false)
  const [loading, setLoading] = useState(true)

  const toggleMenu = () => setMenuOpen(!menuOpen)

  // Check if user has a company when session changes
  useEffect(() => {
    const checkCompanyMembership = async () => {
      if (!session?.user?.id) {
        setHasCompany(false)
        setLoading(false)
        return
      }

      try {
        // Use our server action to check if the user has a company
        const result = await checkUserCompany(session.user.id)
        setHasCompany(result.hasCompany)
      } catch (error) {
        console.error("Falha ao checar empresa:", error)
        setHasCompany(false)
      } finally {
        setLoading(false)
      }
    }

    if (session && !isPending) {
      checkCompanyMembership()
    } else if (!session && !isPending) {
      setHasCompany(false)
      setLoading(false)
    }
  }, [session, isPending])

  return (
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
          <Link href="/" className="hover:text-green-200 transition-colors">
            Início
          </Link>
          <Link href="/agendamentos/novo" className="hover:text-green-200 transition-colors">
            Agendar Coleta
          </Link>
          <Link href="/dicas" className="hover:text-green-200 transition-colors">
            Dicas
          </Link>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Carregando...</span>
            </div>
          ) : (
            <Link
              href={hasCompany ? "/dashboard-empresa" : "/parceiros"}
              className="hover:text-green-200 transition-colors"
            >
              {hasCompany ? "Minha Empresa" : "Quero ser um parceiro"}
            </Link>
          )}
          <UserButton />
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-green-700 p-4 flex flex-col gap-4 z-50">
            <Link href="/" className="hover:text-green-200 transition-colors">
              Início
            </Link>
            <Link href="/agendamentos/novo" className="hover:text-green-200 transition-colors">
              Agendar Coleta
            </Link>
            <Link href="/dicas" className="hover:text-green-200 transition-colors">
              Dicas
            </Link>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Carregando...</span>
              </div>
            ) : (
              <Link
                href={hasCompany ? "/dashboard-empresa" : "/parceiros"}
                className="hover:text-green-200 transition-colors"
              >
                {hasCompany ? "Dashboard Empresa" : "Quero ser um parceiro"}
              </Link>
            )}
            <UserButton />
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar

