import {
  LogError,
  Ec2Control,
  Ec2State,
  Ec2Status,
  Auth,
  PersistToken,
  AdminErrKind,
} from "../../lib";
import { None, sleep } from "../../shared";

const maxCount = 25;

export interface Ec2ManageAuthStatus {
  pending(): void;
  none(): void;
  authenticated(token: string): void;
}

export interface Ec2ManageEc2State {
  on(ip: string): void;
  off(): void;
  pending(): void;
}

export interface RouteEc2Page {
  onUnauthenticated(): void;
}

export async function validateToken(
  ec2State: Ec2ManageEc2State,
  logger: LogError,
  authService: Auth,
  authState: Ec2ManageAuthStatus,
  tokenService: PersistToken,
  router: RouteEc2Page
) {
  authState.pending();
  ec2State.pending();

  const token = await tokenService.token();
  if (token.isErr()) {
    const err = token.unwrapErr();
    if (err.kind !== AdminErrKind.ConfigNone) {
      logger.logDevMsg(err.toString());
      logger.logUserMsg("Oops something went wrong");
    }
    authState.none();
    router.onUnauthenticated();
    return;
  }

  const tokenStr = token.unwrap();
  const res = await authService.validateToken(tokenStr);
  if (res.isErr()) {
    const err = res.unwrapErr();
    if (err.kind !== AdminErrKind.AuthErr) {
      logger.logDevMsg(err.toString());
      logger.logUserMsg("Oops something went wrong");
    }
    authState.none();
    router.onUnauthenticated();
    return;
  }

  const valid = res.unwrap();

  if (!valid) {
    authState.none();
    router.onUnauthenticated();
    return;
  }
  authState.authenticated(tokenStr);
}

export async function turnEc2Off(
  ec2Service: Ec2Control,
  ec2State: Ec2ManageEc2State,
  logger: LogError
) {
  await handleEc2Action(ec2Service, ec2State, logger, "off");
}

export async function turnEc2On(
  ec2Service: Ec2Control,
  ec2State: Ec2ManageEc2State,
  logger: LogError
) {
  await handleEc2Action(ec2Service, ec2State, logger, "on");
}

export async function pollEc2Status(
  ec2Service: Ec2Control,
  ec2State: Ec2ManageEc2State,
  logger: LogError
) {
  await handleEc2Action(ec2Service, ec2State, logger, "status");
}

async function handleEc2Action(
  ec2Service: Ec2Control,
  ec2State: Ec2ManageEc2State,
  logger: LogError,
  action: "on" | "off" | "status"
) {
  ec2State.pending();
  let count = 0;

  let result: Ec2State = {
    status: Ec2Status.Pending,
    ip: None(),
  };

  if (action === "on") {
    await ec2Service.turnEc2On();
  } else if (action === "off") {
    await ec2Service.turnEc2Off();
  }

  /// We keep polling for the ec2 status until it either reaches max count
  /// or it is no longer pending
  while (count < maxCount) {
    const res = await ec2Service.ec2Status();
    if (res.isErr()) {
      logger.logDevMsg(res.unwrapErr().toString());
      logger.logDevMsg(`Oops something went wrong`);
      break;
    }
    result = res.unwrap();
    if (result.status !== Ec2Status.Pending) {
      break;
    }
    await sleep(2000);
    count++;
  }

  /// if the desired status is on
  if (action === "on") {
    /// if the result status is desired
    if (result.status === Ec2Status.On) {
      /// if there is an ip
      if (result.ip.isSome()) {
        ec2State.on(result.ip.unwrap());
        return;
      }
      /// if no ip
      logger.logDevMsg("Ec2 missing public ip");
      logger.logUserMsg("Oops we couldn't find your ec2's public ip");
      ec2State.off();
      return;
    }
    /// if the result status is not on
    logger.logDevMsg(`Ec2 status is not on, ec2 status is :${result.status}`);
    logger.logUserMsg("Oops, we couldn't start your ec2 instance");
    ec2State.off();
    return;

    /// if the desired status is off
  } else if (action === "off") {
    /// if it succeeded
    if (result.status === Ec2Status.Off) {
      ec2State.off();
      return;
    }
    /// if it didn't succeed
    logger.logDevMsg(`Ec2 status is not off, ec2 status is :${result.status}`);
    logger.logUserMsg("Oops, we couldn't stop your ec2 instance");
    ec2State.on("unknown ip error");
    return;

    /// if its a status check
  } else if (action === "status") {
    /// if its on, check for ip
    if (result.status === Ec2Status.On) {
      if (result.ip.isSome()) {
        ec2State.on(result.ip.unwrap());
        return;
      }
      /// if no ip
      logger.logDevMsg("Ec2 missing public ip");
      logger.logUserMsg("Oops we couldn't find your ec2's public ip");
      return;
    } else if (result.status === Ec2Status.Off) {
      ec2State.off();
      return;
    }
  }

  /// if none of the above cases fit, its an error
  logger.logDevMsg("Failed to get ec2 status");
  logger.logUserMsg("Oops, we couldn't get information for your ec2 instance");
}
