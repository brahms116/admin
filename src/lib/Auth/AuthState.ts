import { None, RsOption } from "../../shared";

interface ConstructorParams {
  isAuth: boolean;
  token?: RsOption<string>;
}

interface ClassFields extends Required<ConstructorParams> {}

export interface AuthState extends ClassFields {}
export class AuthState {
  constructor(n: ConstructorParams) {
    const withDefaults: ClassFields = { token: None(), ...n };
    Object.assign(this, withDefaults);
  }

  copy(): AuthState {
    return new AuthState({ isAuth: this.isAuth, token: this.token });
  }
}
