"use client"

import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export default function CadastroPage() {
  const [activeTab, setActiveTab] = useState("pessoal")

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full p-4 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-lg font-semibold">E-COLETA</div>
          <Link href="/login" className="text-sm">
            Entre
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid lg:grid-cols-2">
        {/* Left Side - Logo */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-r from-[#3C6499] to-[#375377] p-8">
          <div className="text-white text-4xl font-bold text-center">
            <Image
              src="/imagens/logo-full-branco.png"
              alt="E-COLETA logo"
              width={500}
              height={600}
              className="object-contain"
            />
          </div>
        </div>

        {/* Right Side - Cadastro Form */}
        <div className="flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Cadastre-se</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pessoal">Informações Pessoais</TabsTrigger>
                  <TabsTrigger value="endereco">Endereço</TabsTrigger>
                </TabsList>
                <TabsContent value="pessoal" className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="nomeCompleto" className="text-sm font-medium">
                      Nome Completo
                    </label>
                    <Input id="nomeCompleto" type="text" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="cpf" className="text-sm font-medium">
                      CPF
                    </label>
                    <Input id="cpf" type="text" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="telefone" className="text-sm font-medium">
                      Telefone
                    </label>
                    <Input id="telefone" type="tel" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="senha" className="text-sm font-medium">
                        Senha
                      </label>
                      <Input id="senha" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="confirmarSenha" className="text-sm font-medium">
                        Confirmar Senha
                      </label>
                      <Input id="confirmarSenha" type="password" required />
                    </div>
                  </div>
                  <Button className="w-full bg-[#3B5578] hover:bg-[#2f4460]" onClick={() => setActiveTab("endereco")}>
                    Próximo
                  </Button>
                </TabsContent>
                <TabsContent value="endereco" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="cep" className="text-sm font-medium">
                        CEP
                      </label>
                      <Input id="cep" type="text" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="numeroCasa" className="text-sm font-medium">
                        Nº da casa
                      </label>
                      <Input id="numeroCasa" type="text" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="endereco" className="text-sm font-medium">
                      Endereço
                    </label>
                    <Input id="endereco" type="text" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="complemento" className="text-sm font-medium">
                        Complemento
                      </label>
                      <Input id="complemento" type="text" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="bairro" className="text-sm font-medium">
                        Bairro
                      </label>
                      <Input id="bairro" type="text" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="cidade" className="text-sm font-medium">
                        Cidade
                      </label>
                      <Input id="cidade" type="text" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="estado" className="text-sm font-medium">
                        Estado
                      </label>
                      <Input id="estado" type="text" required />
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("pessoal")}
                      className="bg-white text-[#3B5578] border-[#3B5578] hover:bg-[#3B5578] hover:text-white"
                    >
                      Voltar
                    </Button>
                    <Button type="submit" className="bg-[#3B5578] hover:bg-[#2f4460]">
                      Finalizar Cadastro
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

