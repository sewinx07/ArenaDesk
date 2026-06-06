import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { api } from './api';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      cafeId: string;
    };
    accessToken: string;
  }
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    cafeId: string;
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
    cafeId: string;
    accessToken: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const raw = await api.post<{
            success: boolean;
            data: {
              user: {
                id: string;
                email: string;
                name: string;
                role: string;
                cafeId: string;
              };
              accessToken: string;
            };
          }>('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          const userData = raw.data;
          return {
            id: userData.user.id,
            email: userData.user.email,
            name: userData.user.name,
            role: userData.user.role,
            cafeId: userData.user.cafeId,
            accessToken: userData.accessToken,
          };
        } catch (error: any) {
          console.error('NextAuth authorize error:', error?.message || error);
          throw new Error(error?.message || 'Invalid email or password');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.cafeId = user.cafeId;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
        cafeId: token.cafeId,
      };
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
