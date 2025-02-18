"use server";

import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db/client";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";

export async function updateUsuario(
  tel_usu: string,
  cpf_usu: string,
  email: string
) {
  const sessao = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sessao) {
    unauthorized();
  }

  if (sessao.user.email !== email) {
    unauthorized();
  }

  await db
    .update(user)
    .set({
      tel_usu: tel_usu,
      cpf_usu: cpf_usu,
    })
    .where(eq(user.email, email));
}
