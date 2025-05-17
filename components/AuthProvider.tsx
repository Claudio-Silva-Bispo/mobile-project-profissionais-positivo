
/* Instalar npm install @react-native-async-storage/async-storage
npm install --save-dev @types/react-native */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { clearAuthData, saveAuthData, saveUserData } from "../utils/authUtils";

type User = {
  name: string;
  email: string;
  password: string;
};

interface AuthState {
  isReady: boolean;
  users: User[];
  userName: string;
  isSignedIn: boolean;
}

type AuthContextType = {
  addUser: (user: User) => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  userName: string;
  isSignedIn: boolean;
  isAuthReady: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authState, setAuthState] = useState<AuthState>({
    isReady: false,
    users: [],
    userName: "",
    isSignedIn: false,
  });

  const router = useRouter();

  const addUser = (user: User) => {
    setAuthState(prev => ({
      ...prev,
      users: [...prev.users, user]
    }));
    saveUserData(user);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedUsers, storedUserName, storedIsSignedIn] = await Promise.all([
          AsyncStorage.getItem("users"),
          AsyncStorage.getItem("userName"),
          AsyncStorage.getItem("isSignedIn"),
        ]);

        setAuthState({
          isReady: true,
          users: storedUsers ? JSON.parse(storedUsers) : [],
          userName: storedUserName || "",
          isSignedIn: storedIsSignedIn === "true",
        });
      } catch (error) {
        console.error("Erro ao carregar dados do AsyncStorage:", error);
        setAuthState(prev => ({ ...prev, isReady: true }));
      }
    };

    loadData();
  }, []);

  const signIn = async (email: string, password: string) => {
    const user = authState.users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      const newState = {
        ...authState,
        userName: user.name,
        isSignedIn: true
      };
      
      setAuthState(newState);

      try {
        await saveAuthData(user.name);
        console.log('Dados dos usuário salvo:', user)
        return true;
      } catch (error) {
        console.error("Error saving sign-in state:", error);
        return false;
      }
    }
    return false;
  };

  const signOut = async () => {
    setAuthState(prev => ({
      ...prev,
      userName: "",
      isSignedIn: false
    }));

    try {
      await clearAuthData();
      await AsyncStorage.removeItem("users");
      console.log('Fazendo logout... dados apagados:')
    } catch (error) {
      console.error("Erro ao limpar estado de sign-in:", error);
    }
  };

  const currentValue = {
    addUser,
    signIn,
    signOut,
    userName: authState.userName,
    isSignedIn: authState.isSignedIn,
    isAuthReady: authState.isReady
  };

  return (
    <AuthContext.Provider value={currentValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;