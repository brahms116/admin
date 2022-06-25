import { AdminErrKind, Auth, PersistToken } from "../../lib";
import { LogError } from "../../lib/Logger";

export interface RouteLoginPage {
  onAuthenticated(): void;
}

export interface ChangeAuthStatus {
  pending(): void;
  none(): void;
  authenticated(token: string): void;
}

export async function checkToken(
  authSvr: Auth,
  authState: ChangeAuthStatus,
  tokenSvr: PersistToken,
  router: RouteLoginPage,
  logger: LogError
) {
  const token = await tokenSvr.token();

  if (token.isErr()) {
    const err = token.unwrapErr();
    if (err.kind !== AdminErrKind.ConfigNone) {
      logger.logDevMsg(err.toString());
      logger.logUserMsg("Oops something went wrong");
    }
    authState.none();
    return;
  }

  authState.pending();
  const tokenStr = token.unwrap();
  const res = await authSvr.validateToken(tokenStr);
  if (res.isErr()) {
    const err = res.unwrapErr();
    if (err.kind !== AdminErrKind.AuthErr) {
      logger.logDevMsg(err.toString());
      logger.logUserMsg("Oops something went wrong");
    }
    authState.none();
    return;
  }

  const valid = res.unwrap();

  if (!valid) {
    authState.none();
    return;
  }

  authState.authenticated(tokenStr);
  router.onAuthenticated();
}
