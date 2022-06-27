import {
  AdminErrKind,
  Auth,
  PersistToken,
  TextFieldControl,
  LogError,
} from "../../lib";

export interface LoginManageAuthStatus {
  pending(): void;
  none(): void;
  authenticated(token: string): void;
}

export interface RouteLoginPage {
  onAuthenticated(): void;
}

export async function signIn(
  authSvr: Auth,
  authState: LoginManageAuthStatus,
  tokenSvr: PersistToken,
  router: RouteLoginPage,
  logger: LogError,
  pwd: TextFieldControl
) {
  if (pwd.getFieldErr().length) {
    return;
  }
  authState.pending();
  authState.none();
  const pwdStr = pwd.getField();
  const res = await authSvr.authenticate(pwdStr);

  if (res.isErr()) {
    const err = res.unwrapErr();
    if (err.kind !== AdminErrKind.AuthErr) {
      logger.logDevMsg(err.toString());
      logger.logUserMsg("Oops something is wrong");
    } else {
      pwd.setFieldErr("Oops not the right password");
    }
    authState.none();
    return;
  }

  const token = res.unwrap();
  await tokenSvr.saveToken(token);
  authState.authenticated(token);
  router.onAuthenticated();
}

export async function checkToken(
  authSvr: Auth,
  authState: LoginManageAuthStatus,
  tokenSvr: PersistToken,
  router: RouteLoginPage,
  logger: LogError
) {
  authState.pending();

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

export function updatePwdField(text: string, pwd: TextFieldControl) {
  pwd.setField(text);
  pwd.setFieldErr("");
}
