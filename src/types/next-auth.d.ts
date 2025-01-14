import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    accessToken: string
    user: {
      id: string
    } & DefaultSession["user"]
  }

  interface Profile {
    id: string
    username: string
    discriminator: string
    avatar: string | null
    email?: string
    connections?: Array<{
      id: string
      name: string
      type: string
      verified: boolean
    }>
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string | undefined
    userId: string | undefined
    tokenType: string
  }
}
