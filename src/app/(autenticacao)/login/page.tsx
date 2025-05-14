"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { signIn } from "@/lib/auth/client"


export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  // Estado para o formulário de login
  const [loginData, setLoginData] = useState({
    email: "",
    senha: "",
  })

  // Função para manipular o formulário
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("") // Limpa erros anteriores

    await signIn.email(
      {
        email: loginData.email,
        password: loginData.senha,
      },
      {
        onSuccess: async () => {
          router.push("/")
        },
        onError: () => {
          setError("Email ou senha estão incorretos")
        },
      },
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      

      <main className="container mx-auto py-12 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
              <Recycle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-800">E-Coleta</h1>
            <p className="text-gray-600 mt-2">Acesse sua conta para agendar coletas e acompanhar seus agendamentos</p>
          </div>

          <Card className="border-green-100 shadow-md">
            <CardHeader className="border-b border-green-100 bg-green-50">
              <CardTitle className="text-xl font-bold text-green-800">Entrar na sua conta</CardTitle>
              <CardDescription>Digite seu e-mail e senha para acessar</CardDescription>
            </CardHeader>
            <form onSubmit={handleLoginSubmit}>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="pl-10 border-green-200 focus-visible:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                      Senha
                    </label>
                    <Link href="/redefinicao-senha" className="text-xs text-green-600 hover:text-green-800">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="senha"
                      name="senha"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginData.senha}
                      onChange={handleLoginChange}
                      className="pl-10 border-green-200 focus-visible:ring-green-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
                    {error}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-green-100 pt-6 flex flex-col space-y-4">
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Entrar
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Não tem uma conta?{" "}
                  <Link href="/cadastro" className="text-green-600 hover:text-green-800 font-medium">
                    Cadastre-se
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Ao fazer login, você concorda com nossos{" "}
              <Link href="/termos" className="text-green-600 hover:text-green-800 underline">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link href="/privacidade" className="text-green-600 hover:text-green-800 underline">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-600">
        <p>© 2025 E-Coleta. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}

