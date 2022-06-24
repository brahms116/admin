import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function useAuthGuard() {
  const navigate = useNavigate();
  useEffect(() => {
    if (true) navigate("/");
  }, []);
}
