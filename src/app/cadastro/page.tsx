"use client";

import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signUp } from "@/lib/auth/client";
import {
  updateUsuario,
  VerificarCPF,
  VerificarEmail,
  VerificarTelefone,
} from "./funcoes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CadastroPage() {
  const router = useRouter();

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [isSenhaLonga, setIsSenhaLonga] = useState(false);
  const [isCpfValido, setIsCpfValido] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [telefone, setTelefone] = useState("");
  const [cpfExistente, setCpfExistente] = useState<boolean | null>(null);
  const [emailExistente, setEmailExistente] = useState<boolean | null>(null);
  const [telefoneExistente, setTelefoneExistente] = useState<boolean | null>(
    null
  );
  const [emailTimeout, setEmailTimeout] = useState<NodeJS.Timeout | null>(null);
  const [telefoneTimeout, setTelefoneTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Validar Senha
  const validarSenha = (senha: string) => {
    setIsSenhaLonga(senha.length >= 8);
  };

  // Validar CPF
  function validarCPF(cpf: string) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      setIsCpfValido(false);
      return false;
    }
    let soma = 0,
      resto;
    for (let i = 1; i <= 9; i++) soma += Number.parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== Number.parseInt(cpf[9])) {
      setIsCpfValido(false);
      return false;
    }
    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma += Number.parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== Number.parseInt(cpf[10])) {
      setIsCpfValido(false);
      return false;
    }
    setIsCpfValido(true);
    return true;
  }

  // Máscara de CPF
  function formatarCPF(valor: string) {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  // Máscara de Telefone
  function formatarTelefone(valor: string) {
    return valor
      .replace(/\D/g, "") // Remove tudo que não for número
      .replace(/^(\d{2})(\d)/, "($1) $2") // Formato (XX) XXX
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2"); // Formato (XX) XXXXX-XXXX
  }

  // Função para verificar CPF
  async function verificarCPF(cpf: string) {
    if (cpf.replace(/\D/g, "").length === 11) {
      try {
        const cpfExists = await VerificarCPF(cpf.replace(/\D/g, ""));
        setCpfExistente(cpfExists);
      } catch (error) {
        console.error("Erro ao verificar CPF:", error);
        setCpfExistente(null);
      }
    }
  }

  // Função para verificar Email
  async function verificarEmail(email: string) {
    if (email && email.includes("@") && email.includes(".")) {
      try {
        const emailExists = await VerificarEmail(email);
        setEmailExistente(emailExists);
      } catch (error) {
        console.error("Erro ao verificar Email:", error);
        setEmailExistente(null);
      }
    }
  }

  // Função para verificar Telefone
  async function verificarTelefone(telefone: string) {
    const telefoneNumerico = telefone.replace(/\D/g, "");
    if (telefoneNumerico.length >= 10) {
      // Verifica se tem pelo menos 10 dígitos (com DDD)
      try {
        const telefoneExists = await VerificarTelefone(telefoneNumerico);
        setTelefoneExistente(telefoneExists);
      } catch (error) {
        console.error("Erro ao verificar Telefone:", error);
        setTelefoneExistente(null);
      }
    }
  }

  // Função de cadastro
  async function cadastrarUsuario(formData: FormData) {
    const nomeCompleto = String(formData.get("nomeCompleto") || "");
    const cpf = String(formData.get("cpf") || "").replace(/\D/g, "");
    const telefone = String(formData.get("telefone") || "").replace(/\D/g, "");
    const email = String(formData.get("email") || "");
    const senha = String(formData.get("senha") || "");

    if (
      !validarCPF(cpf) ||
      senha !== formData.get("confirmarSenha") ||
      cpfExistente ||
      emailExistente ||
      telefoneExistente
    ) {
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
                  <Input
                    id="cpf"
                    name="cpf"
                    type="text"
                    maxLength={14}
                    value={cpf}
                    onChange={(e) => {
                      const cpfFormatted = formatarCPF(e.target.value);
                      setCpf(cpfFormatted);

                      // Only validate when we have a complete CPF
                      if (e.target.value.replace(/\D/g, "").length === 11) {
                        validarCPF(cpfFormatted);
                        verificarCPF(cpfFormatted);
                      } else {
                        setIsCpfValido(true);
                        setCpfExistente(null);
                      }
                    }}
                    required
                  />
                  {!isCpfValido && (
                    <p className="text-red-500 text-sm">CPF inválido</p>
                  )}
                  {cpfExistente && (
                    <p className="text-red-500 text-sm">CPF já cadastrado</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="telefone" className="text-sm font-medium">
                    Telefone
                  </label>
                  <Input
                    id="telefone"
                    name="telefone"
                    type="text"
                    maxLength={15} // Permite (XX) XXXXX-XXXX
                    value={telefone}
                    onChange={(e) => {
                      const telefoneFormatted = formatarTelefone(
                        e.target.value
                      );
                      setTelefone(telefoneFormatted);

                      // Limpa o timeout anterior se existir
                      if (telefoneTimeout) clearTimeout(telefoneTimeout);

                      // Configura um novo timeout para verificar após o usuário parar de digitar
                      const newTimeout = setTimeout(() => {
                        if (telefoneFormatted.replace(/\D/g, "").length >= 10) {
                          verificarTelefone(telefoneFormatted);
                        } else {
                          setTelefoneExistente(null);
                        }
                      }, 500);

                      setTelefoneTimeout(newTimeout);
                    }}
                    required
                  />
                  {telefoneExistente && (
                    <p className="text-red-500 text-sm">
                      Telefone já cadastrado
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);

                      // Limpa o timeout anterior se existir
                      if (emailTimeout) clearTimeout(emailTimeout);

                      // Configura um novo timeout para verificar após o usuário parar de digitar
                      const newTimeout = setTimeout(() => {
                        if (
                          e.target.value &&
                          e.target.value.includes("@") &&
                          e.target.value.includes(".")
                        ) {
                          verificarEmail(e.target.value);
                        } else {
                          setEmailExistente(null);
                        }
                      }, 500);

                      setEmailTimeout(newTimeout);
                    }}
                    required
                  />
                  {emailExistente && (
                    <p className="text-red-500 text-sm">Email já cadastrado</p>
                  )}
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
                    disabled={
                      senha !== confirmarSenha ||
                      senha.trim() === "" ||
                      senha.length < 8 ||
                      !isCpfValido ||
                      cpfExistente === true ||
                      emailExistente === true ||
                      telefoneExistente === true
                    }
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
