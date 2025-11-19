import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Slot } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackgroundProvider } from "../src/context/BackgroundContext";

type AuthData = {
  usuarioId: string;
  token: string;
  expiresAt?: string | null;
};

type AuthContextType = {
  auth: AuthData | null;
  isLoadingAuth: boolean;
  setAuthData: (data: AuthData | null) => Promise<void>;
  clearAuthData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    async function loadAuth() {
      try {
        const stored = await AsyncStorage.getItem("@restartai/auth");
        if (stored) {
          const parsed = JSON.parse(stored) as AuthData;
          if (parsed?.usuarioId && parsed?.token) {
            setAuth(parsed);
          }
        }
      } catch (e) {
        console.log("Erro ao carregar auth:", e);
      } finally {
        setIsLoadingAuth(false);
      }
    }

    loadAuth();
  }, []);

  async function setAuthData(data: AuthData | null) {
    setAuth(data);
    if (data) {
      await AsyncStorage.setItem("@restartai/auth", JSON.stringify(data));
    } else {
      await AsyncStorage.removeItem("@restartai/auth");
    }
  }

  async function clearAuthData() {
    setAuth(null);
    await AsyncStorage.removeItem("@restartai/auth");
  }

  return (
    <AuthContext.Provider
      value={{ auth, isLoadingAuth, setAuthData, clearAuthData }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default function RootLayout() {
  return (
    <BackgroundProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </BackgroundProvider>
  );
}
