import React, { createContext, useEffect, useReducer } from "react";
import authReducer from "src/contexts/AuthReducer";
import { AppLocalStorage } from "src/utils";

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};
interface AuthContextProps {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

export const loadUserFromStorage = async () => {
  try {
    const userString = await AppLocalStorage.getItem("user");
    if (userString) {
      return JSON.parse(userString);
    }
  } catch (error) {
    console.error("Error loading user data from local storage:", error);
  }

  return null;
};

export const AuthContext = createContext<AuthContextProps>({
  state: initialState,
  dispatch: () => null,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      const user = await loadUserFromStorage();
      dispatch({ type: "LOAD_USER_FROM_STORAGE", payload: user });
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
