import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackgroundProvider } from "../src/context/BackgroundContext";

type AuthData = {
  usuarioId: string;
  token: string;
  expiresAt: string;
};

type AuthContextValue = {
  auth: AuthData | null;
  isLoadingAuth: boolean;
  setAuthData: (data: AuthData) => Promise<void>;
  clearAuthData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  auth: null,
  isLoadingAuth: true,
  setAuthData: async () => {},
  clearAuthData: async () => {},
});

const AUTH_STORAGE_KEY = "@restartai/auth";

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    async function loadAuth() {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as AuthData;
          setAuth(parsed);
        }
      } finally {
        setIsLoadingAuth(false);
      }
    }
    loadAuth();
  }, []);

  async function setAuthData(data: AuthData) {
    setAuth(data);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  }

  async function clearAuthData() {
    setAuth(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ auth, isLoadingAuth, setAuthData, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default function RootLayout() {
  return (
    <BackgroundProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </BackgroundProvider>
  );
}
