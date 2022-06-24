import { ZodError } from "zod";
import { None, RsOption, Some } from "../../shared";
import { formatZodMsg } from "../Validation";
import { AdminErrKind } from "./AdminErrKind";

export class AdminErr {
  public kind: AdminErrKind;
  public msg: RsOption<string>;

  constructor() {
    this.kind = AdminErrKind.Unknown;
    this.msg = None();
  }

  zod(err: ZodError, ctxStr: RsOption<string> = None()) {
    this.kind = AdminErrKind.ZodErr;
    this.msg = Some(formatZodMsg(err, ctxStr));
    return this;
  }

  auth() {
    this.kind = AdminErrKind.AuthErr;
    return this;
  }

  req() {
    this.kind = AdminErrKind.ReqErr;
    return this;
  }

  server() {
    this.kind = AdminErrKind.ServerErr;
    return this;
  }
}
