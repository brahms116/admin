import { createContext, useContext, useState } from "react";
import React from "react";
import { AuthState } from "./AuthState";

const authContext = createContext<AuthState>(new AuthState({ isAuth: false }));

export const AuthContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [authState, setAuthstate] = useState(new AuthState({ isAuth: true }));

  return (
    <authContext.Provider value={authState}>{children}</authContext.Provider>
  );
};

export const useAuthContext = () => useContext(authContext);
