
import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins"


export const { signIn, signUp, useSession, signOut,organization } = createAuthClient({
    plugins: [
        organizationClient() 

    ]
});
