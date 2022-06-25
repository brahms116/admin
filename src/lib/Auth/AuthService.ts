import { Fetch } from "../FetchUtils";
import { Err, Ok, Opt, RsResult, Some } from "../../shared";
import { z } from "zod";
import { AdminErr, AdminErrKind } from "../AdminErr";

export interface Auth {
  authenticate(pwd: string): Promise<RsResult<string, AdminErr>>;
  validateToken(token: string): Promise<RsResult<boolean, AdminErr>>;
}

export interface PersistToken {
  saveToken(tk: string): Promise<RsResult<string, AdminErr>>;
  token(): Promise<RsResult<string, AdminErr>>;
}

export class AuthService implements Auth {
  async validateToken(token: string): Promise<RsResult<boolean, AdminErr>> {
    const body = {
      command: "ec2-control",
      data: {
        operation: "status",
      },
    };

    const resSchema = z.any();
    const res = await new Fetch().fetch(body, resSchema, Some(token));

    if (res.isOk()) {
      return Ok(true);
    }
    const err = res.unwrapErr();

    if (err.kind === AdminErrKind.AuthErr) {
      return Ok(false);
    }

    return Err(err);
  }

  async authenticate(pwd: string): Promise<RsResult<string, AdminErr>> {
    const body = {
      command: "get-token",
      data: {
        password: pwd,
      },
    };
    const resSchema = z.object({
      token: z.string(),
    });

    const res = await new Fetch().fetch(body, resSchema);
    return res.map((e) => e.token);
  }
}

export class LocalStorageToken implements PersistToken {
  async saveToken(tk: string): Promise<RsResult<string, AdminErr>> {
    window.localStorage.setItem("adminToken", tk);
    return Ok(tk);
  }

  async token(): Promise<RsResult<string, AdminErr>> {
    const token = Opt(window.localStorage.getItem("adminToken"));
    return token.okOr(new AdminErr().configNone("JWT-TOKEN"));
  }
}
