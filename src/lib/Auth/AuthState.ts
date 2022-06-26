import { None, RsOption, Some } from "../../shared";
import { AuthStatus } from "./AuthStatus";

export interface ChangeAuthStatus {
  pending(): void;
  none(): void;
  authenticated(token: string): void;
}

interface ConstructorParams {
  authStatus: AuthStatus;
  token?: RsOption<string>;
}

interface ClassFields extends Required<ConstructorParams> {}

export interface AuthState extends ClassFields {}
export class AuthState {
  constructor(n: ConstructorParams) {
    const withDefaults: ClassFields = {
      token: None(),
      ...n,
    };
    Object.assign(this, withDefaults);
  }

  setCreds(tk: string) {
    this.authStatus = AuthStatus.Authenticated;
    this.token = Some(tk);
    return this.copy();
  }

  clearCreds() {
    this.authStatus = AuthStatus.None;
    this.token = None();
    return this.copy();
  }

  pending() {
    this.authStatus = AuthStatus.Pending;
    this.token = None();
    return this.copy();
  }

  copy(): AuthState {
    return new AuthState({
      authStatus: this.authStatus,
      token: this.token,
    });
  }
}
