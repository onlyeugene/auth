import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "./auth.config"; // Importing custom authentication config
import { prisma } from "./lib/db"; // Importing Prisma ORM instance
import { PrismaAdapter } from "@auth/prisma-adapter"; // Adapter to use Prisma with NextAuth
import { getUserById } from "./data/user"; // Helper function to fetch a user by ID from the database
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/accounts";

declare module "next-auth" {
  interface Session {
    user: {
      role?: UserRole;
      isTwoFactorEnabled?: boolean;
      isOAuth?: boolean
      // "ADMIN" | "USER";
    } & DefaultSession["user"];
  }
}

// Initialize NextAuth and destructure the handlers and other functions like `auth`, `signIn`, `signOut`
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: { emailVerified: new Date() },
      });
    },
  },
  // Define callback functions to customize authentication behavior
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification

      // we can still do this 
      // if (account?.provider === 'credentials') {
      //   const existingUser = await getUserById(user.id as string);

      //   if (!existingUser?.emailVerified) return false;
      // }
      if (account?.provider !== "credentials") return true;

      //Prevent sign in without email verification
      // we could do this for the user.id error
      if (!user.id) return false;
      const existingUser = await getUserById(user.id);

      // or this
      // const existingUser = await getUserById(user.id as string);

      if (!existingUser?.emailVerified) return false;

      if(existingUser.isTwoFactorEnabled){
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if(!twoFactorConfirmation) return false

        //Delete two factor confirmation for next sign in
        await prisma.twoFactorConfirmation.delete({
          where: {id: twoFactorConfirmation.id}
        })
      }

      return true;
    },
    // Callback to modify the session object before it is returned to the client
    async session({ token, session }) {
      console.log({
        sessionToken: token, // Log the session token for debugging
        // session,  // You could log the entire session object if needed
      });

      // If the token contains a user ID (sub) and the session contains a user, assign the user ID to the session
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      // If the token contains a role and the session contains a user, assign the user role to the session
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
     
      if(session.user){
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
      }

      //was later called for updating the session
      if(session.user){
        session.user.name = token.name as string;
        session.user.email = token.email as string
        session.user.isOAuth = token.isOAuth as boolean
      }

      // Return the modified session object
      return session;
    },

    // Callback to customize the JWT (JSON Web Token) object before it is stored
    async jwt({ token }) {
      
      // If the token does not contain a user ID, return it unchanged
      if (!token.sub) return token;

      
      // Fetch the user from the database using the user ID (sub)
      const existingUser = await getUserById(token.sub);
      
      // If the user is not found, return the token as is
      if (!existingUser) return token;
     
      // for providers 
      const existingAccount = await getAccountByUserId(existingUser.id)
      
      token.isOAuth = !!existingAccount
      // was later called for updating the session
      token.name= existingUser?.name
      token.email = existingUser?.email
      // Add the user's role to the token
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      // Return the modified token with the added role
      return token;
    },
  },

  // Set PrismaAdapter to enable NextAuth to store and retrieve authentication data from Prisma-managed database
  adapter: PrismaAdapter(prisma),

  // Use JWT-based sessions instead of cookies stored on the server
  session: { strategy: "jwt" },

  // Spread the remaining custom authentication configurations (e.g., providers, custom pages) from the auth.config file
  ...authConfig,
});
