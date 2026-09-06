import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Simple demo auth - in production connect to your user DB and
        // verify the password against it instead of accepting any value.
        if (credentials?.email && credentials?.password) {
          // CHANGED: id used to be hardcoded to "1" for every credentials
          // login, so every demo account shared one familyMemberId and
          // could see (and edit/delete) every other account's registered
          // elders. Derive a stable per-email id instead — same email
          // always maps to the same account, different emails never
          // collide. Normalized (trimmed + lowercased) so "User@x.com"
          // and "user@x.com" resolve to the same account.
          const normalizedEmail = credentials.email.trim().toLowerCase();
          return {
            id: normalizedEmail,
            email: normalizedEmail,
            name: normalizedEmail.split("@")[0],
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
