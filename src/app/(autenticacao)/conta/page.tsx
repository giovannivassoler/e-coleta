"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, CreditCard, Phone, Mail, Lock, ChevronRight, X, Eye, EyeOff, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navbar from "@/components/navbar" // Certifique-se de que o caminho está correto

import { useSession, signOut } from "@/lib/auth/client"
import { useRouter } from "next/navigation"
import { atualizarSenha, buscarUsuario, atualizarUsuario } from "./actions"

// Interface para os dados do usuário
interface UserData {
  id: string
  name: string
  email: string
  cpf_usu: string | null
  tel_usu: string | null
}

export default function MinhaContaPage() {
  const router = useRouter()
  const sessao = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean
    type: "success" | "error"
    message: string
  } | null>(null)

  // Estados para controlar os modais
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  // Estados para o formulário de edição
  const [editForm, setEditForm] = useState({
    name: "",
    tel_usu: "",
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

  // Função para mostrar notificação
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({
      show: true,
      type,
      message,
    })

    // Esconder a notificação após 3 segundos
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Verifica se tem sessão ativa
  useEffect(() => {
    if (sessao.data) {
      carregarDadosUsuario()
    } else if (sessao.isPending === false) {
      router.push("/login")
    }
  }, [sessao, router])

  // Função para carregar dados do usuário
  const carregarDadosUsuario = async () => {
    if (!sessao.data?.user?.id) return

    try {
      setIsLoading(true)
      const usuario = await buscarUsuario(sessao.data.user.id)

      if (usuario) {
        setUserData(usuario)
        setEditForm({
          name: usuario.name,
          tel_usu: usuario.tel_usu || "",
          email: usuario.email,
        })
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error)
      showNotification("error", "Não foi possível carregar seus dados. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

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

    if (name === "tel_usu") {
      setEditForm((prev) => ({
        ...prev,
        tel_usu: formatarTelefone(value),
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
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userData?.id) return

    try {
      setIsSaving(true)

      // Chamar a função de atualização de dados
      const resultado = await atualizarUsuario(userData.id, {
        name: editForm.name,
        tel_usu: editForm.tel_usu,
        email: editForm.email,
      })

      if (resultado.success) {
        // Atualiza os dados do usuário na interface
        setUserData((prev) => {
          if (!prev) return null
          return {
            ...prev,
            name: editForm.name,
            tel_usu: editForm.tel_usu,
            email: editForm.email,
          }
        })

        setEditSuccess(true)

        // Esconde a mensagem de sucesso após 2 segundos
        setTimeout(() => {
          setEditSuccess(false)
          setShowEditModal(false)

          // Mostrar notificação de sucesso
          showNotification("success", "Suas informações foram atualizadas com sucesso.")
        }, 2000)
      } else {
        showNotification("error", resultado.message || "Não foi possível atualizar seus dados.")
      }
    } catch (error) {
      console.error("Erro ao atualizar dados:", error)
      showNotification("error", "Não foi possível atualizar seus dados. Tente novamente mais tarde.")
    } finally {
      setIsSaving(false)
    }
  }

  // Função para salvar nova senha
  const handleSavePassword = async (e: React.FormEvent) => {
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

    if (!userData?.id) {
      setPasswordError("Erro ao identificar usuário")
      return
    }

    try {
      setIsSaving(true)

      // Chamar a função de atualização de senha
      const resultado = await atualizarSenha({
        userId: userData.id,
        senhaAtual: passwordForm.senhaAtual,
        novaSenha: passwordForm.novaSenha,
      })

      if (resultado.success) {
        setPasswordSuccess(true)

        // Esconde a mensagem de sucesso após 2 segundos
        setTimeout(() => {
          setPasswordSuccess(false)
          setShowPasswordModal(false)
          setPasswordForm({
            senhaAtual: "",
            novaSenha: "",
            confirmarSenha: "",
          })

          // Mostrar notificação de sucesso
          showNotification("success", "Sua senha foi alterada com sucesso.")
        }, 2000)
      } else {
        setPasswordError(resultado.message || "Erro ao atualizar senha")
      }
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error)
      setPasswordError(error.message || "Erro ao atualizar senha")
    } finally {
      setIsSaving(false)
    }
  }

  // Função para alternar visibilidade da senha
  const togglePasswordVisibility = (field: "senhaAtual" | "novaSenha" | "confirmarSenha") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  // Função para fazer logout
  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  // Função para formatar CPF
  const formatarCPF = (cpf: string | null) => {
    if (!cpf) return ""
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Notificação flutuante */}
        {notification && notification.show && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-md ${
              notification.type === "success"
                ? "bg-green-100 border border-green-200 text-green-800"
                : "bg-red-100 border border-red-200 text-red-800"
            }`}
          >
            <p>{notification.message}</p>
          </div>
        )}

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
                        <p className="text-lg font-medium">{userData?.name}</p>
                        <Separator className="my-4" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <CreditCard className="h-4 w-4" />
                          <span>CPF</span>
                        </div>
                        <p className="text-lg font-medium">
                          {userData?.cpf_usu ? formatarCPF(userData.cpf_usu) : "Não informado"}
                        </p>
                        <Separator className="my-4" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <Phone className="h-4 w-4" />
                          <span>Telefone</span>
                        </div>
                        <p className="text-lg font-medium">{userData?.tel_usu || "Não informado"}</p>
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
                        href="/agendamentos"
                        className="flex items-center justify-between p-4 hover:bg-green-50 transition-colors"
                      >
                        <span className="font-medium">Minhas Coletas</span>
                        <ChevronRight className="h-5 w-5 text-green-600" />
                      </Link>
                      <Separator />
                      <button
                        className="w-full flex items-center justify-between p-4 hover:bg-green-50 transition-colors text-red-600"
                        onClick={handleLogout}
                      >
                        <span className="font-medium">Sair da Conta</span>
                        <LogOut className="h-5 w-5" />
                      </button>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </main>

        <footer className="py-6 text-center text-sm text-gray-600 mt-12">
          <p>© 2025 E-Coleta. Todos os direitos reservados.</p>
        </footer>
      </div>

      {/* Modal para Editar Informações */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
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
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="border-green-200 focus-visible:ring-green-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tel_usu">Telefone</Label>
                  <Input
                    id="tel_usu"
                    name="tel_usu"
                    value={editForm.tel_usu}
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
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isSaving}>
                  {isSaving ? (
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
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
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isSaving}>
                  {isSaving ? (
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
    </>
  )
}

