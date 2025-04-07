"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth/client"
import { FormDataProvider } from "./hooks/use-form-data"
import AgendarColeta from "./agendar-coleta"

export default function AppWrapper() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Se a verificação da sessão foi concluída
    if (!isPending) {
      if (!session) {
        // Se não há sessão ativa, redirecionar para a página de login
        router.push("/login")
      } else {
        // Se há sessão, apenas atualizar o estado de carregamento
        setIsLoading(false)
      }
    }
  }, [session, isPending, router])

  // Mostrar um indicador de carregamento enquanto verifica a sessão
  if (isPending || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-green-800">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se a verificação foi concluída e há sessão, renderizar o conteúdo
  return (
    <FormDataProvider>
      <AgendarColeta />
    </FormDataProvider>
  )
}

