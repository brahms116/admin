import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../App";
import {
  AuthService,
  AuthStatus,
  LocalStorageToken,
  LogError,
  TextFieldControl,
} from "../../lib";
import {
  checkToken,
  RouteLoginPage,
  signIn,
  LoginManageAuthStatus,
  updatePwdField,
} from "./funcs";

export function useLogin() {
  const authService = new AuthService();
  const tokenService = new LocalStorageToken();

  const logger: LogError = {
    logDevMsg: (m) => console.log(m),
    logUserMsg: (m) => console.log("user", m),
  };

  const [pwd, setPwd] = useState("");
  const [pwdErr, setPwdErr] = useState("");

  const navigate = useNavigate();
  const router: RouteLoginPage = {
    onAuthenticated: () => navigate("/ec2-control"),
  };

  function getPwd() {
    return pwd;
  }

  function getPwdErr() {
    return pwdErr;
  }

  const pwdControl: TextFieldControl = {
    setFieldErr: setPwdErr,
    getField: getPwd,
    getFieldErr: getPwdErr,
    setField: setPwd,
  };

  const auth = useAuth((state) => state.c);
  const update = useAuth((state) => state.update);

  const authControl: LoginManageAuthStatus = {
    authenticated: (token: string) => {
      update(auth.setCreds(token));
    },
    none: () => {
      update(auth.clearCreds());
    },
    pending: () => {
      update(auth.pending());
    },
  };

  function checkTokenClosure() {
    checkToken(authService, authControl, tokenService, router, logger);
  }

  function signInClosure() {
    signIn(authService, authControl, tokenService, router, logger, pwdControl);
  }

  function handlePwdChange(text: string) {
    updatePwdField(text, pwdControl);
  }

  const isLoading = auth.authStatus === AuthStatus.Pending;
  return {
    pwdControl,
    isLoading,
    checkToken: checkTokenClosure,
    handlePwdChange,
    signIn: signInClosure,
  };
}
