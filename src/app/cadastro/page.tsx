"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, Mail, Lock, Eye, EyeOff, User, Phone, CreditCard } from "lucide-react"
import { signUp } from "@/lib/auth/client"
import { updateUsuario, VerificarCPF, VerificarEmail, VerificarTelefone } from "./funcoes"
import Navbar from "../componentes/navbar"

export default function CadastroPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  // Estados para os campos do formulário
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    cpf: "",
    telefone: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  })

  // Estados para validação
  const [isSenhaLonga, setIsSenhaLonga] = useState(false)
  const [isCpfValido, setIsCpfValido] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [cpfExistente, setCpfExistente] = useState<boolean | null>(null)
  const [emailExistente, setEmailExistente] = useState<boolean | null>(null)
  const [telefoneExistente, setTelefoneExistente] = useState<boolean | null>(null)
  const [emailTimeout, setEmailTimeout] = useState<NodeJS.Timeout | null>(null)
  const [telefoneTimeout, setTelefoneTimeout] = useState<NodeJS.Timeout | null>(null)

  // Validar Senha
  const validarSenha = (senha: string) => {
    setIsSenhaLonga(senha.length >= 8)
  }

  // Validar CPF
  function validarCPF(cpf: string) {
    cpf = cpf.replace(/\D/g, "")
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      setIsCpfValido(false)
      return false
    }
    let soma = 0,
      resto
    for (let i = 1; i <= 9; i++) soma += Number.parseInt(cpf[i - 1]) * (11 - i)
    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== Number.parseInt(cpf[9])) {
      setIsCpfValido(false)
      return false
    }
    soma = 0
    for (let i = 1; i <= 10; i++) soma += Number.parseInt(cpf[i - 1]) * (12 - i)
    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== Number.parseInt(cpf[10])) {
      setIsCpfValido(false)
      return false
    }
    setIsCpfValido(true)
    return true
  }

  // Máscara de CPF
  function formatarCPF(valor: string) {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  }

  // Máscara de Telefone
  function formatarTelefone(valor: string) {
    return valor
      .replace(/\D/g, "") // Remove tudo que não for número
      .replace(/^(\d{2})(\d)/, "($1) $2") // Formato (XX) XXX
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2") // Formato (XX) XXXXX-XXXX
  }

  // Função para verificar CPF
  async function verificarCPF(cpf: string) {
    if (cpf.replace(/\D/g, "").length === 11) {
      try {
        const cpfExists = await VerificarCPF(cpf.replace(/\D/g, ""))
        setCpfExistente(cpfExists)
      } catch (error) {
        console.error("Erro ao verificar CPF:", error)
        setCpfExistente(null)
      }
    }
  }

  // Função para verificar Email
  async function verificarEmail(email: string) {
    if (email && email.includes("@") && email.includes(".")) {
      try {
        const emailExists = await VerificarEmail(email)
        setEmailExistente(emailExists)
      } catch (error) {
        console.error("Erro ao verificar Email:", error)
        setEmailExistente(null)
      }
    }
  }

  // Função para verificar Telefone
  async function verificarTelefone(telefone: string) {
    const telefoneNumerico = telefone.replace(/\D/g, "")
    if (telefoneNumerico.length >= 10) {
      try {
        const telefoneExists = await VerificarTelefone(telefoneNumerico)
        setTelefoneExistente(telefoneExists)
      } catch (error) {
        console.error("Erro ao verificar Telefone:", error)
        setTelefoneExistente(null)
      }
    }
  }

  // Função para lidar com mudanças nos campos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "cpf") {
      const cpfFormatted = formatarCPF(value)
      setFormData((prev) => ({ ...prev, cpf: cpfFormatted }))

      if (value.replace(/\D/g, "").length === 11) {
        validarCPF(cpfFormatted)
        verificarCPF(cpfFormatted)
      } else {
        setIsCpfValido(true)
        setCpfExistente(null)
      }
      return
    }

    if (name === "telefone") {
      const telefoneFormatted = formatarTelefone(value)
      setFormData((prev) => ({ ...prev, telefone: telefoneFormatted }))

      if (telefoneTimeout) clearTimeout(telefoneTimeout)
      const newTimeout = setTimeout(() => {
        if (telefoneFormatted.replace(/\D/g, "").length >= 10) {
          verificarTelefone(telefoneFormatted)
        } else {
          setTelefoneExistente(null)
        }
      }, 500)
      setTelefoneTimeout(newTimeout)
      return
    }

    if (name === "email") {
      setFormData((prev) => ({ ...prev, email: value }))

      if (emailTimeout) clearTimeout(emailTimeout)
      const newTimeout = setTimeout(() => {
        if (value && value.includes("@") && value.includes(".")) {
          verificarEmail(value)
        } else {
          setEmailExistente(null)
        }
      }, 500)
      setEmailTimeout(newTimeout)
      return
    }

    if (name === "senha") {
      setFormData((prev) => ({ ...prev, senha: value }))
      validarSenha(value)
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Função de cadastro
  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault()

    const { nomeCompleto, cpf, telefone, email, senha, confirmarSenha } = formData

    if (
      !validarCPF(cpf) ||
      senha !== confirmarSenha ||
      cpfExistente ||
      emailExistente ||
      telefoneExistente ||
      senha.length < 8
    ) {
      return
    }

    setIsLoading(true)

    await signUp.email(
      {
        email,
        password: senha,
        name: nomeCompleto,
      },
      {
        onSuccess: async () => {
          await updateUsuario(telefone.replace(/\D/g, ""), cpf.replace(/\D/g, ""), email)
          setIsLoading(false)
          router.push("/")
        },
        onError: () => {
          setIsLoading(false)
        },
      },
    )
  }

  // Limpar timeouts ao desmontar o componente
  useEffect(() => {
    return () => {
      if (emailTimeout) clearTimeout(emailTimeout)
      if (telefoneTimeout) clearTimeout(telefoneTimeout)
    }
  }, [emailTimeout, telefoneTimeout])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar></Navbar>

      <main className="container mx-auto py-12 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
              <Recycle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-800">E-Coleta</h1>
            <p className="text-gray-600 mt-2">Crie sua conta para agendar coletas de lixo eletrônico</p>
          </div>

          <Card className="border-green-100 shadow-md">
            <CardHeader className="border-b border-green-100 bg-green-50">
              <CardTitle className="text-xl font-bold text-green-800">Criar nova conta</CardTitle>
              <CardDescription>Preencha os dados abaixo para se cadastrar</CardDescription>
            </CardHeader>
            <form onSubmit={handleRegisterSubmit}>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700">
                    Nome completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="nomeCompleto"
                      name="nomeCompleto"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.nomeCompleto}
                      onChange={handleInputChange}
                      className="pl-10 border-green-200 focus-visible:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                    CPF
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="cpf"
                      name="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      maxLength={14}
                      value={formData.cpf}
                      onChange={handleInputChange}
                      className="pl-10 border-green-200 focus-visible:ring-green-500"
                      required
                    />
                  </div>
                  {!isCpfValido && <p className="text-red-500 text-xs">CPF inválido</p>}
                  {cpfExistente && <p className="text-red-500 text-xs">CPF já cadastrado</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="telefone"
                      name="telefone"
                      type="text"
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="pl-10 border-green-200 focus-visible:ring-green-500"
                      required
                    />
                  </div>
                  {telefoneExistente && <p className="text-red-500 text-xs">Telefone já cadastrado</p>}
                </div>

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
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 border-green-200 focus-visible:ring-green-500"
                      required
                    />
                  </div>
                  {emailExistente && <p className="text-red-500 text-xs">Email já cadastrado</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="senha"
                      name="senha"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.senha}
                      onChange={handleInputChange}
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
                  <p className={`text-xs ${isSenhaLonga ? "text-green-500" : "text-red-500"}`}>
                    {isSenhaLonga ? "A senha tem mais de 8 caracteres." : "A senha deve ter mais de 8 caracteres."}
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmarSenha"
                      name="confirmarSenha"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmarSenha}
                      onChange={handleInputChange}
                      className="pl-10 border-green-200 focus-visible:ring-green-500"
                      required
                    />
                  </div>
                  {formData.senha !== formData.confirmarSenha && formData.confirmarSenha && (
                    <p className="text-red-500 text-xs">As senhas não coincidem</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t border-green-100 pt-6 flex flex-col space-y-4">
                {isLoading ? (
                  <div className="flex justify-center w-full py-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-700"></div>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={
                      formData.senha !== formData.confirmarSenha ||
                      formData.senha.trim() === "" ||
                      formData.senha.length < 8 ||
                      !isCpfValido ||
                      cpfExistente === true ||
                      emailExistente === true ||
                      telefoneExistente === true
                    }
                  >
                    Criar Conta
                  </Button>
                )}

                <p className="text-center text-sm text-gray-600">
                  Já tem uma conta?{" "}
                  <Link href="/login" className="text-green-600 hover:text-green-800 font-medium">
                    Faça login
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Ao se cadastrar, você concorda com nossos{" "}
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

