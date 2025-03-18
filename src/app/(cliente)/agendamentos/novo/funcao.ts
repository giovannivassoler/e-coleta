"use server";

import { db } from "@/lib/db/client";
import { FormData } from "./hooks/use-form-data";
import { coletaTable } from "@/lib/db/schema";
import { auth } from "@/lib/auth/config";
import { randomBytes } from "crypto";
import { headers } from "next/headers";
function gerarSenha() {
  // Gerar 8 bytes aleatórios
  const bytes = randomBytes(8);

  // Converter os bytes em uma string hexadecimal
  const senha = bytes.toString("hex").slice(0, 8);

  return senha;
}
function criarDataHora(data: string, horario: string) {
  // Separar a data em dia, mês e ano
  const [dia, mes, ano] = data.split("/");

  // Separar o horário em horas e minutos
  const [hora, minutos] = horario.split(":");

  // Criar o objeto Date com os valores
  const dataHora = new Date(`${ano}-${mes}-${dia}T${hora}:${minutos}:00`);

  return dataHora;
}
function juntarEndereco(endereco: FormData): string {
  const {
    endereco: rua,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    cep,
  } = endereco;

  let enderecoCompleto = `${rua}, ${numero}`;

  if (complemento) {
    enderecoCompleto += `, ${complemento}`;
  }

  enderecoCompleto += ` - ${bairro}, ${cidade} - ${estado}, ${cep}`;

  return enderecoCompleto;
}
export async function validarEmail(email: string) {
  const user = await db.query.user.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, email);
    },
  });
  return !user;
}

function criarUsuario(usuario: FormData["personalInfo"]) {
  return auth.api.signUpEmail({
    body: { email: usuario.email, name: usuario.nome, password: gerarSenha() },
  });
}

export async function criarPedido(formData: FormData) {
  const sessao = await auth.api.getSession({
    headers: await headers(),
  });

  let idUsuario = sessao?.user.id;
  if (!idUsuario) {
    const user = await criarUsuario(formData.personalInfo);
    idUsuario = user.user.id;
    if (!idUsuario) {
      throw new Error("Não foi possível criar conta");
    }
  }

  await db.insert(coletaTable).values({
    data_coleta: criarDataHora(formData.data, formData.horario).toISOString(),
    destinacao_final: juntarEndereco(formData),
    id_usuario: idUsuario,
    status_coleta: "Solicitado",
  });
}
