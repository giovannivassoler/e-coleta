import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins"


export const { signIn, signUp, useSession, signOut,organization, changePassword, forgetPassword, resetPassword } = createAuthClient({
    plugins: [
        organizationClient() 

    ]
});
