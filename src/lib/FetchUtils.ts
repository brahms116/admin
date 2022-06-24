import { RsOption, None, RsResult, Ok, Err, Some } from "../shared";
import { BASE_URL } from "../config";
import { AdminErr } from "./AdminErr";
import { z, ZodTypeAny } from "zod";

const errZod = z.object({
  msg: z.string(),
});

export class Fetch {
  async fetch<T extends ZodTypeAny>(
    body: any,
    resSchema: T,
    token: RsOption<string> = None()
  ): Promise<RsResult<z.infer<typeof resSchema>, AdminErr>> {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token.unwrapOr(""),
      },
      body,
    });

    const json = await res.json();

    if (res.ok) {
      const result = resSchema.safeParse(json);
      if (result.success) {
        return Ok(result.data);
      }
      const err = new AdminErr().zod(
        result.error,
        Some("At parsing a fetch response,")
      );
      err.msg.map((e) => console.log(e));
      return Err(err);
    }

    const result = errZod.safeParse(json);
    if (result.success) {
      console.log(result.data.msg);
    }

    const err = new AdminErr();
    switch (res.status) {
      case 400:
        return Err(err.req());
      case 403:
        return Err(err.auth());
      case 500:
        return Err(err.server());
      default:
        return Err(err);
    }
  }
}
