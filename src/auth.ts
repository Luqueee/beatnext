import NextAuth, { type Session as NextAuthSession } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import type { JWT } from "next-auth/jwt";

export type session =
  | (Session & {
      accessToken?: string;
      refreshToken?: string;
    })
  | null;

interface Session extends NextAuthSession {
  accessToken?: string;
  refreshToken?: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.AUTH_SPOTIFY_ID!,
      clientSecret: process.env.AUTH_SPOTIFY_SECRET!,

      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-private user-read-email user-top-read user-library-read", // Agregar scopes según sea necesario
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      const now = Date.now();

      // Si hay un nuevo inicio de sesión, asignar el token de acceso y de refresco
      if (account) {
        token.accessToken = account.access_token!;
        token.refreshToken = account.refresh_token!;
        token.accessTokenExpires = now + account.expires_at!; // `expires_at` está en segundos
        token.accessTokenGetDate = now;
        return token;
      }

      //console.log("Token", token, "now", now);

      // Verificar si el token aún no ha expirado
      if (token.accessTokenExpires && now < token.accessTokenExpires) {
        return token;
      }

      // Refrescar el token si ha expirado
      if (token.refreshToken) {
        try {
          const authorization = Buffer.from(
            `${process.env.AUTH_SPOTIFY_ID}:${process.env.AUTH_SPOTIFY_SECRET}`
          ).toString("base64");

          const response = await fetch(
            "https://accounts.spotify.com/api/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${authorization}`,
              },
              body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
              }),
            }
          );

          const tokens = await response.json();

          console.log("Refreshed tokens", tokens);

          if (!response.ok) {
            throw new Error(`Failed to refresh token: ${tokens.error}`);
          }

          token.accessToken = tokens.access_token;
          token.accessTokenExpires = now + tokens.expires_in * 1000; // Expiración en milisegundos
          if (tokens.refresh_token) {
            token.refreshToken = tokens.refresh_token; // Actualizar refresh_token si Spotify lo proporciona
          }
        } catch (error) {
          console.error("Error refreshing access token", error);
          token.error = "RefreshTokenError";
        }
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      if (token.error) session.error = token.error;
      return session;
    },
  },
});

// Extender interfaces de tipado
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    error?: "RefreshTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
    error?: "RefreshTokenError";
  }
}
