import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Ensure environment variables are available with fallbacks
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "776ac261bf6a78f244791e5ce72a1c9ff07a10aecd9665aab7b4cf7690a70144";
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

// Debug environment variables
console.log("NEXTAUTH_SECRET:", NEXTAUTH_SECRET);
console.log("NEXTAUTH_URL:", NEXTAUTH_URL);

// Validate secret
if (!NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is required");
}

// Set environment variables explicitly for NextAuth
process.env.NEXTAUTH_SECRET = NEXTAUTH_SECRET;
process.env.NEXTAUTH_URL = NEXTAUTH_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: NEXTAUTH_SECRET,
  debug: false,
  url: NEXTAUTH_URL,
};
