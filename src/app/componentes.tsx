"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth/client";
import Link from "next/link";

export function UserButton() {
  const { data } = useSession();

  if (!data) {
    return (
      <Link href="/login" className="hover:opacity-80">
        Login
      </Link>
    );
  }
  return (
    <div>
      <b>
        <Link href="/minhaconta" className="hover:opacity-80">
          Olá, {data.user.name}
        </Link>
      </b>
      <Button className="hover:opacity-80" onClick={() => signOut()}>
        Sair
      </Button>
    </div>
  );
}
