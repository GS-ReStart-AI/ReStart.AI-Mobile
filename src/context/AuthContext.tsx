import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthData = {
  usuarioId: string;
  token: string;
  expiresAt: string;
};

type AuthContextValue = {
  auth: AuthData | null;
  isLoadingAuth: boolean;
  setAuth: (data: AuthData) => Promise<void>;
  logout: () => Promise<void>;
  refreshFromStorage: () => Promise<void>;
};

const AUTH_STORAGE_KEY = "@restartai/auth";

const AuthContext = createContext<AuthContextValue>({
  auth: null,
  isLoadingAuth: true,
  setAuth: async () => {},
  logout: async () => {},
  refreshFromStorage: async () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuthState] = useState<AuthData | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const refreshFromStorage = async () => {
    try {
      setIsLoadingAuth(true);
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: AuthData = JSON.parse(stored);
        setAuthState(parsed);
      } else {
        setAuthState(null);
      }
    } catch {
      setAuthState(null);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  useEffect(() => {
    refreshFromStorage();
  }, []);

  const setAuth = async (data: AuthData) => {
    setAuthState(data);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  };

  const logout = async () => {
    setAuthState(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ auth, isLoadingAuth, setAuth, logout, refreshFromStorage }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
