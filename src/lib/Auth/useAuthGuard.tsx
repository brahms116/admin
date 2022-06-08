import { useAuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function useAuthGuard() {
  const authCtx = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (!authCtx.isAuth) {
      navigate("/");
    }
  }, [authCtx.isAuth]);
}
