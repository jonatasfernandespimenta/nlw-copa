import { createContext, ReactNode, useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBroser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { api } from "../services/api";

WebBroser.maybeCompleteAuthSession();

interface UserPops {
  name: string;
  avatarUrl: string;
}

export interface AuthContextDataProps {
  user: UserPops;
  signIn: () => Promise<void>;
  isUserLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [user, setUser] = useState<UserPops>({} as UserPops);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ["profile", "email"],
  });

  async function signIn() {
    try {
      setIsUserLoading(true);
      await promptAsync();
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }

  async function signInWithGoogle(accessToken: string) {
    try {
      setIsUserLoading(true);

      const tokenResponse = await api.post("/users", {
        access_token: accessToken,
      });

      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${tokenResponse.data.token}`;

      const userInfoResponse = await api.get('/me');

      console.log(userInfoResponse.data.user)

      setUser(userInfoResponse.data.user)
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        user,
        isUserLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
