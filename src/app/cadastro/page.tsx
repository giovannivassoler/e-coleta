"use client";

import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signUp } from "@/lib/auth/client";
import { updateUsuario } from "./funcoes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CadastroPage() {
  const router = useRouter();

  // Verificar Senha
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isSenhaLonga, setIsSenhaLonga] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para controle de loading

  // Validar Senha
  const validarSenha = (senha: string) => {
    setIsSenhaLonga(senha.length >= 8);
  };

  // Função de cadastro
  async function cadastrarUsuario(formData: FormData) {
    const nomeCompleto = formData.get("nomeCompleto");
    const cpf = formData.get("cpf");
    const telefone = formData.get("telefone");
    const email = formData.get("email");
    const senha = formData.get("senha");

    if (senha !== formData.get("confirmarSenha")) {
      return;
    }

    if (
      typeof nomeCompleto !== "string" ||
      typeof cpf !== "string" ||
      typeof telefone !== "string" ||
      typeof email !== "string" ||
      typeof senha !== "string"
    ) {
      return;
    }

    setIsLoading(true); // Inicia o loading

    await signUp.email(
      {
        email,
        password: senha,
        name: nomeCompleto,
      },
      {
        onSuccess: async () => {
          await updateUsuario(telefone, cpf, email);
          setIsLoading(false); // Finaliza o loading
          router.push("/");
        },
      }
    );
  }

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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  cadastrarUsuario(formData);
                }}
              >
                <div className="space-y-2">
                  <label htmlFor="nomeCompleto" className="text-sm font-medium">
                    Nome Completo
                  </label>
                  <Input
                    id="nomeCompleto"
                    name="nomeCompleto"
                    type="text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cpf" className="text-sm font-medium">
                    CPF
                  </label>
                  <Input id="cpf" name="cpf" type="text" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="telefone" className="text-sm font-medium">
                    Telefone
                  </label>
                  <Input id="telefone" name="telefone" type="tel" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="senha" className="text-sm font-medium">
                      Senha
                    </label>
                    <Input
                      id="senha"
                      name="senha"
                      type="password"
                      value={senha}
                      onChange={(e) => {
                        setSenha(e.target.value);
                        validarSenha(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmarSenha"
                      className="text-sm font-medium"
                    >
                      Confirmar Senha
                    </label>
                    <Input
                      id="confirmarSenha"
                      name="confirmarSenha"
                      type="password"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <br></br>
                {/* Requisitos Senha */}
                <div className="text-sm text-gray-500 mt-1">
                  <p
                    className={`${
                      isSenhaLonga ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isSenhaLonga
                      ? "A senha tem mais de 8 caracteres."
                      : "A senha deve ter mais de 8 caracteres."}
                  </p>
                </div>
                <br></br>

                {/* Loading Indicator */}
                {isLoading ? (
                  <div className="flex justify-center mt-4">
                    <div className="animate-spin border-4 border-t-4 border-blue-500 rounded-full w-8 h-8"></div>
                  </div>
                ) : (
                  <Button
                    className="w-full bg-[#3B5578] hover:bg-[#2f4460]"
                    disabled={senha !== confirmarSenha || senha.trim() === ""}
                  >
                    Cadastrar
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
