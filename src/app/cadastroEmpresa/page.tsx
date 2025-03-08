"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "../componentes/navbar";

export default function CadastroEmpresaPage() {
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [telefone, setTelefone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica de cadastro
    console.log("Cadastro submetido", {
      razaoSocial,
      cnpj,
      email,
      senha,
      telefone,
    });
    // Após o cadastro bem-sucedido, você redirecionaria o usuário
    // router.push('/dashboard-empresa');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar></Navbar>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Cadastro de Empresa Parceira
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="razaoSocial"
                  className="block text-sm font-medium text-gray-700"
                >
                  Razão Social
                </label>
                <Input
                  id="razaoSocial"
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="cnpj"
                  className="block text-sm font-medium text-gray-700"
                >
                  CNPJ
                </label>
                <Input
                  id="cnpj"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="telefone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Telefone
                </label>
                <Input
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="endereco"
                  className="block text-sm font-medium text-gray-700"
                >
                  Endereço
                </label>
                <Input id="endereco" required />
              </div>
              <div>
                <label
                  htmlFor="senha"
                  className="block text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirmarSenha"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmar Senha
                </label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Cadastrar Empresa
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2023 E-COLETA. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
