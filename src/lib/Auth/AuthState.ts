import { None, RsOption, Some } from "../../shared";
import { AuthStatus } from "./AuthStatus";

interface ConstructorParams {
  authStatus: AuthStatus;
  token?: RsOption<string>;
  updateFunc?: RsOption<() => void>;
}

interface ClassFields extends Required<ConstructorParams> {}

export interface AuthState extends ClassFields {}
export class AuthState {
  constructor(n: ConstructorParams) {
    const withDefaults: ClassFields = {
      token: None(),
      updateFunc: None(),
      ...n,
    };
    Object.assign(this, withDefaults);
  }

  setCreds(tk: string) {
    this.authStatus = AuthStatus.Authenticated;
    this.token = Some(tk);
    this.updateFunc.map((e) => e());
  }

  clearCreds() {
    this.authStatus = AuthStatus.None;
    this.token = None();
    this.updateFunc.map((e) => e());
  }

  pending() {
    this.authStatus = AuthStatus.Pending;
    this.token = None();
    this.updateFunc.map((e) => e());
  }

  copy(): AuthState {
    return new AuthState({
      authStatus: this.authStatus,
      token: this.token,
      updateFunc: this.updateFunc,
    });
  }
}
