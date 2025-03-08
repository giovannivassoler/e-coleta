"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, FileText, Lock } from "lucide-react";
import { AlterarSenha } from "./AlterarSenha";

// Dados de exemplo do usuário
const userData = {
  nome: "João Silva",
  cpf: "123.456.789-00",
  telefone: "(11) 98765-4321",
  email: "joao.silva@exemplo.com",
};

export function InfoPessoal() {
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // Se estiver mostrando a tela de alteração de senha
  if (showPasswordChange) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <AlterarSenha onSuccess={() => setShowPasswordChange(false)} />
      </div>
    );
  }

  // Tela padrão de informações pessoais
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Informações Pessoais</h1>
        <p className="text-muted-foreground mt-1">
          Visualize e gerencie suas informações pessoais
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Dados Cadastrais</CardTitle>
          <CardDescription>Informações básicas da sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User size={18} />
                <span className="text-sm font-medium">Nome Completo</span>
              </div>
              <p className="font-medium">{userData.nome}</p>
              <Separator />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText size={18} />
                <span className="text-sm font-medium">CPF</span>
              </div>
              <p className="font-medium">{userData.cpf}</p>
              <Separator />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone size={18} />
                <span className="text-sm font-medium">Telefone</span>
              </div>
              <p className="font-medium">{userData.telefone}</p>
              <Separator />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail size={18} />
                <span className="text-sm font-medium">Email</span>
              </div>
              <p className="font-medium">{userData.email}</p>
              <Separator />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>
            Gerencie as configurações de segurança da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Senha</h3>
                <p className="text-sm text-muted-foreground">
                  Altere sua senha de acesso
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPasswordChange(true)}
            >
              Alterar Senha
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
