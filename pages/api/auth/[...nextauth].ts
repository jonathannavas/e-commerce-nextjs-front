import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import { dbUsers } from '../../../database'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: {
          label: 'Correo:',
          type: 'email',
          placeholder: 'correo@correo.com',
        },
        password: {
          label: 'Contraseña:',
          type: 'password',
          placeholder: 'Contraseña',
        },
      },
      async authorize(credentials) {
        return await dbUsers.checkUserEmailPassword(
          credentials!.email,
          credentials!.password
        )
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  // custom pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  session: {
    maxAge: 2592000, //30d = 60seg*60min*24hrs*30d
    strategy: 'jwt',
    updateAge: 86400, //1d = 60seg*60min*24hrs
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        switch (account.type) {
          case 'oauth':
            token.user = await dbUsers.oAuthToDb(
              user?.email || '',
              user?.name || ''
            )
            break
          case 'credentials':
            token.user = user
            break
        }
      }
      return token
    },
    async session({ session, token, user }) {
      session.accessToken = token.access_token as any
      session.user = token.user as any
      return session
    },
  },
})
