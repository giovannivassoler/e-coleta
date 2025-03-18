"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, CreditCard, Phone, Mail, Lock, ChevronRight, X, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useSession } from "@/lib/auth/client"
import { useRouter } from "next/navigation";


// Simulação de dados do usuário
interface UserData {
  nome: string
  cpf: string
  telefone: string
  email: string
}

export default function MinhaContaPage() {

  const sessao = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verifica se tem sessão ativa
  useEffect(() => {
    if (sessao.data) {
    } else if (sessao.isPending === false) {
      router.push("/login");
    }
  }, [sessao, router]);


  // Estados para controlar os modais
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  // Estados para o formulário de edição
  const [editForm, setEditForm] = useState({
    nome: "",
    telefone: "",
    email: "",
  })

  // Estados para o formulário de senha
  const [passwordForm, setPasswordForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  })

  // Estado para mostrar/ocultar senhas
  const [showPasswords, setShowPasswords] = useState({
    senhaAtual: false,
    novaSenha: false,
    confirmarSenha: false,
  })

  // Estados para feedback
  const [editSuccess, setEditSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  // Simular carregamento de dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      // Simulação de uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Dados simulados
      const data = {
        nome: "João Silva",
        cpf: "123.456.789-00",
        telefone: "(11) 98765-4321",
        email: "joao.silva@exemplo.com",
      }

      setUserData(data)
      setEditForm({
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
      })

      setIsLoading(false)
    }

    fetchUserData()
  }, [])

  // Função para formatar telefone
  const formatarTelefone = (valor: string) => {
    return valor
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
  }

  // Manipulador para o formulário de edição
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "telefone") {
      setEditForm((prev) => ({
        ...prev,
        telefone: formatarTelefone(value),
      }))
      return
    }

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manipulador para o formulário de senha
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Função para salvar edições
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulação de salvamento
    setIsLoading(true)

    setTimeout(() => {
      // Atualiza os dados do usuário
      setUserData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          nome: editForm.nome,
          telefone: editForm.telefone,
          email: editForm.email,
        }
      })

      setIsLoading(false)
      setEditSuccess(true)

      // Esconde a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setEditSuccess(false)
        setShowEditModal(false)
      }, 2000)
    }, 1000)
  }

  // Função para salvar nova senha
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    // Validação simples
    if (passwordForm.novaSenha.length < 8) {
      setPasswordError("A nova senha deve ter pelo menos 8 caracteres")
      return
    }

    if (passwordForm.novaSenha !== passwordForm.confirmarSenha) {
      setPasswordError("As senhas não coincidem")
      return
    }

    // Simulação de salvamento
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setPasswordSuccess(true)

      // Esconde a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setPasswordSuccess(false)
        setShowPasswordModal(false)
        setPasswordForm({
          senhaAtual: "",
          novaSenha: "",
          confirmarSenha: "",
        })
      }, 2000)
    }, 1000)
  }

  // Função para alternar visibilidade da senha
  const togglePasswordVisibility = (field: "senhaAtual" | "novaSenha" | "confirmarSenha") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
    

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-green-800">Informações Pessoais</h1>
            <p className="text-gray-600">Visualize e gerencie suas informações pessoais</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
          ) : (
            <>
              <Card className="border-green-100 shadow-md mb-6">
                <CardHeader className="border-b border-green-100 bg-green-50">
                  <CardTitle className="text-xl font-bold text-green-800">Dados Cadastrais</CardTitle>
                  <CardDescription>Informações básicas da sua conta</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <User className="h-4 w-4" />
                        <span>Nome Completo</span>
                      </div>
                      <p className="text-lg font-medium"></p>
                      <Separator className="my-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <CreditCard className="h-4 w-4" />
                        <span>CPF</span>
                      </div>
                      <p className="text-lg font-medium">{userData?.telefone}</p>
                      <Separator className="my-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Phone className="h-4 w-4" />
                        <span>Telefone</span>
                      </div>
                      <p className="text-lg font-medium">{userData?.telefone}</p>
                      <Separator className="my-4 md:hidden" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </div>
                      <p className="text-lg font-medium">{userData?.email}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="outline"
                      className="border-green-200 text-green-700 hover:bg-green-50"
                      onClick={() => setShowEditModal(true)}
                    >
                      Editar Informações
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-100 shadow-md">
                <CardHeader className="border-b border-green-100 bg-green-50">
                  <CardTitle className="text-xl font-bold text-green-800">Segurança</CardTitle>
                  <CardDescription>Gerencie as configurações de segurança da sua conta</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-full text-green-600">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Senha</h3>
                        <p className="text-sm text-gray-500">Altere sua senha de acesso</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="border-green-200 text-green-700 hover:bg-green-50"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      Alterar Senha
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8">
                <h2 className="text-xl font-bold text-green-800 mb-4">Ações da Conta</h2>
                <Card className="border-green-100 shadow-md">
                  <CardContent className="p-0">
                    <Link
                      href="/minha-conta/coletas"
                      className="flex items-center justify-between p-4 hover:bg-green-50 transition-colors"
                    >
                      <span className="font-medium">Minhas Coletas</span>
                      <ChevronRight className="h-5 w-5 text-green-600" />
                    </Link>
                    <Separator />
                    <button className="w-full flex items-center justify-between p-4 hover:bg-green-50 transition-colors text-red-600">
                      <span className="font-medium">Sair da Conta</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-600 mt-12">
        <p>© 2023 EcoTech Recicla. Todos os direitos reservados.</p>
      </footer>

      {/* Modal para Editar Informações */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-green-800">Editar Informações</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={editForm.nome}
                    onChange={handleEditChange}
                    className="border-green-200 focus-visible:ring-green-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    value={editForm.telefone}
                    onChange={handleEditChange}
                    className="border-green-200 focus-visible:ring-green-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="border-green-200 focus-visible:ring-green-500"
                    required
                  />
                </div>

                {editSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md text-sm">
                    Informações atualizadas com sucesso!
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 p-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="border-gray-200"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                      <span>Salvando...</span>
                    </div>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Alterar Senha */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-green-800">Alterar Senha</h2>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePassword}>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="senhaAtual">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="senhaAtual"
                      name="senhaAtual"
                      type={showPasswords.senhaAtual ? "text" : "password"}
                      value={passwordForm.senhaAtual}
                      onChange={handlePasswordChange}
                      className="border-green-200 focus-visible:ring-green-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("senhaAtual")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.senhaAtual ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="novaSenha">Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="novaSenha"
                      name="novaSenha"
                      type={showPasswords.novaSenha ? "text" : "password"}
                      value={passwordForm.novaSenha}
                      onChange={handlePasswordChange}
                      className="border-green-200 focus-visible:ring-green-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("novaSenha")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.novaSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">A senha deve ter pelo menos 8 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmarSenha"
                      name="confirmarSenha"
                      type={showPasswords.confirmarSenha ? "text" : "password"}
                      value={passwordForm.confirmarSenha}
                      onChange={handlePasswordChange}
                      className="border-green-200 focus-visible:ring-green-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirmarSenha")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirmarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md text-sm">
                    Senha alterada com sucesso!
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 p-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordModal(false)}
                  className="border-gray-200"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                      <span>Salvando...</span>
                    </div>
                  ) : (
                    "Alterar Senha"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

