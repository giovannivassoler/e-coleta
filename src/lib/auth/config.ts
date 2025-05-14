import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/client";
import { organization } from "better-auth/plugins";
import { resend } from "../email/client";
import { render } from "@react-email/components";
import PasswordResetEmail from "../email/esqueci-senha";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, token }) => {
      resend.emails.send({
        from: "contato@ecoleta.online",
        to: user.email,
        subject: "Seu código acabou de chegar!",
        html: await render(PasswordResetEmail(token)),
      });
    },
  },
  plugins: [organization({})],
});
