import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db/client";
import { usersTable } from "@/lib/db/schema";

export default async function CadastroPage() {
  /*const dados = db.select({
    id: usersTable.id,
  }).from(usersTable);*/

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
                action={async (formData: FormData) => {
                  "use server";
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

                  await db
                    .insert(usersTable)
                    .values({
                      nome_usu: nomeCompleto,
                      cpf_usu: cpf,
                      tel_usu: telefone,
                      email_usu: email,
                      senha_usu: senha,
                    })
                    .execute();
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
                    <Input id="senha" name="senha" type="password" required />
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
                      required
                    />
                  </div>
                </div>
                <Button className="w-full bg-[#3B5578] hover:bg-[#2f4460]">
                  Cadastrar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
