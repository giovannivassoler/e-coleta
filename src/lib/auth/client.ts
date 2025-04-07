import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins"


export const { signIn, signUp, useSession, signOut,organization, changePassword } = createAuthClient({
    plugins: [
        organizationClient() 

    ]
});
