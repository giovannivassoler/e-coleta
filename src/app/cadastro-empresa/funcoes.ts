"use server";

import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db/client";
import { organization } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";

export async function updateEmpresa(
  tel: string,
  cnpj: string,
  slug: string,
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
  const [resultado] = await db
    .update(organization)
    .set({
      cnpj,
      tel_emp: tel,
    })
    .returning()
    .where(eq(organization.slug, slug));

  if (!resultado) {
    return {status:"Erro"}
  }

}
