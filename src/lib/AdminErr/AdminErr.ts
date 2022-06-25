import { ZodError } from "zod";
import { None, RsOption, Some } from "../../shared";
import { formatZodMsg } from "../Validation";
import { AdminErrKind } from "./AdminErrKind";

export class AdminErr {
  public kind: AdminErrKind;
  public msg: RsOption<string>;

  toString() {
    let msg = `A ${this.kind} occured!`;
    this.msg.map((e) => {
      msg = msg + ` Msg:${e}`;
    });
    return msg;
  }

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

  serviceNone(serviceName: string) {
    this.kind = AdminErrKind.ServiceNone;
    this.msg = Some(`${serviceName} has not been configured`);
    return this;
  }

  configNone(configName: string) {
    this.kind = AdminErrKind.ConfigNone;
    this.msg = Some(`The configuration ${configName}, is missing`);
    return this;
  }

  server() {
    this.kind = AdminErrKind.ServerErr;
    return this;
  }
}
