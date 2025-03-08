"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";

interface AlterarSenhaProps {
  onSuccess?: () => void;
}

export function AlterarSenha({ onSuccess }: AlterarSenhaProps) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError("A nova senha e a confirmação não coincidem");
      return;
    }

    if (novaSenha.length < 8) {
      setError("A nova senha deve ter pelo menos 8 caracteres");
      return;
    }

    setSuccess(true);
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");

    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4 pl-0 flex items-center text-gray-600 hover:text-gray-900"
          onClick={onSuccess}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Alterar Senha</h1>
        <p className="text-muted-foreground mt-1">
          Atualize sua senha para manter sua conta segura
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">
              Sua senha deve ter pelo menos 8 caracteres
            </p>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 border border-red-200 text-red-800">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 border border-green-200 text-green-800">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">Senha alterada com sucesso!</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="senhaAtual"
                  className="block text-sm font-medium mb-1.5"
                >
                  Senha Atual
                </label>
                <div className="relative">
                  <Input
                    id="senhaAtual"
                    type={showCurrentPassword ? "text" : "password"}
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="novaSenha"
                  className="block text-sm font-medium mb-1.5"
                >
                  Nova Senha
                </label>
                <div className="relative">
                  <Input
                    id="novaSenha"
                    type={showNewPassword ? "text" : "password"}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmarSenha"
                  className="block text-sm font-medium mb-1.5"
                >
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <Input
                    id="confirmarSenha"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full mt-6">
              Salvar Nova Senha
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
