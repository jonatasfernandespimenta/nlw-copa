import { createContext, ReactNode, useEffect, useState } from "react";
import * as AuthSession from 'expo-auth-session';
import * as WebBroser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google'

WebBroser.maybeCompleteAuthSession();

interface UserPops {
  name: string;
  avatarUrl: string;
};

export interface AuthContextDataProps {
  user: UserPops;
  signIn: () => Promise<void>;
  isUserLoading: boolean;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {  
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [user, setUser] = useState<UserPops>({} as UserPops);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '227504197743-9sd4icon68f839gt90jobfl56q3ao0u1.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  })
  
  async function signIn() {
    try {
      setIsUserLoading(true);
      await promptAsync();


    } catch (error) {
      console.log(error)
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }
  
  async function signInWithGoogle(accessToken: string) {
    console.log('TOKEN DE AUTH: ', accessToken)
  }

  useEffect(() => {
    if(response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response])

  return(
    <AuthContext.Provider value={{
      signIn,
      user,
      isUserLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}
