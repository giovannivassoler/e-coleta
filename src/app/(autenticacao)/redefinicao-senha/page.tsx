"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgetPassword, resetPassword } from "@/lib/auth/client";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RedefinirSenha() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [codigo, setCodigo] = useState("");
  const [etapa, setEtapa] = useState(1);
  const [enviado, setEnviado] = useState(false);

  const solicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgetPassword({ email });
    setEnviado(true);
    // Simulação de envio de código

    setEtapa(2);
  };

  const redefinirSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword({newPassword:senha,token:codigo})
    // Simulação de verificação de código e redefinição de senha
    setEtapa(3);
  };

  return (
    <main className="flex-1 container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-2">
          Redefinição de Senha
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Siga os passos abaixo para redefinir sua senha
        </p>

        {etapa === 1 && (
          <Card>
            <CardHeader className="bg-green-50 border-b pb-3">
              <h2 className="text-lg font-medium text-green-700">
                Passo 1: Informe seu e-mail
              </h2>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={solicitarCodigo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail cadastrado</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={enviado}
                >
                  {enviado ? "Enviando..." : "Solicitar código de verificação"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {etapa === 2 && (
          <Card>
            <CardHeader className="bg-green-50 border-b pb-3">
              <h2 className="text-lg font-medium text-green-700">
                Passo 2: Código e nova senha
              </h2>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-green-50 p-4 rounded-md mb-4">
                <p className="text-green-700">
                  Enviamos um código de verificação para{" "}
                  <strong>{email}</strong>. Verifique sua caixa de entrada e
                  informe o código e a nova senha abaixo.
                </p>
              </div>
              <form onSubmit={redefinirSenha} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código de verificação</Label>
                  <Input
                    id="codigo"
                    type="text"
                    placeholder="Digite o código recebido"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Nova senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Digite sua nova senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirme a nova senha</Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    placeholder="Digite novamente sua nova senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                  />
                  {senha && confirmarSenha && senha !== confirmarSenha && (
                    <p className="text-red-500 text-sm">
                      As senhas não coincidem
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={
                    !codigo ||
                    !senha ||
                    !confirmarSenha ||
                    senha !== confirmarSenha
                  }
                >
                  Redefinir senha
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {etapa === 3 && (
          <Card>
            <CardHeader className="bg-green-50 border-b pb-3">
              <h2 className="text-lg font-medium text-green-700">
                Senha redefinida com sucesso!
              </h2>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center py-6">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-green-700 mb-2">
                  Tudo pronto!
                </h3>
                <p className="text-gray-600 mb-6">
                  Sua senha foi redefinida com sucesso. Agora você pode entrar
                  na sua conta usando sua nova senha.
                </p>
                <Link href="/login">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Ir para o login <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
