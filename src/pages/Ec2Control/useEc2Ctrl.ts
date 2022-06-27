import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../App";
import {
  AuthService,
  Ec2Service,
  LocalStorageToken,
  LogError,
} from "../../lib";
import { Ec2ControlState } from "./Ec2ControlState";
import {
  Ec2ManageAuthStatus,
  Ec2ManageEc2State,
  pollEc2Status,
  RouteEc2Page,
  turnEc2Off,
  turnEc2On,
  validateToken,
} from "./funcs";

export function useEc2Ctrl() {
  const auth = useAuth((state) => state.c);
  const authService = new AuthService();
  const tokenService = new LocalStorageToken();
  const ec2Service = new Ec2Service(auth.token);
  const isToken = auth.token.isSome();

  const logger: LogError = {
    logDevMsg: (m) => console.log(m),
    logUserMsg: (m) => console.log("user", m),
  };

  const update = useAuth((state) => state.update);

  const authControl: Ec2ManageAuthStatus = {
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

  const [ec2State, setEc2State] = useState(new Ec2ControlState({}));

  const ec2Control: Ec2ManageEc2State = {
    pending: () => setEc2State(ec2State.loading()),
    on: (ip: string) => setEc2State(ec2State.running(ip)),
    off: () => setEc2State(ec2State.stopped()),
  };

  const navigate = useNavigate();
  const router: RouteEc2Page = {
    onUnauthenticated: () => {
      navigate("/");
    },
  };

  async function onReload() {
    await validateToken(
      ec2Control,
      logger,
      authService,
      authControl,
      tokenService,
      router
    );
  }

  async function ec2On() {
    await turnEc2On(ec2Service, ec2Control, logger);
  }

  async function ec2Off() {
    await turnEc2Off(ec2Service, ec2Control, logger);
  }

  async function ec2Status() {
    await pollEc2Status(ec2Service, ec2Control, logger);
  }

  return {
    ec2On,
    ec2Off,
    ec2Status,
    ec2State,
    onReload,
    isToken,
  };
}
