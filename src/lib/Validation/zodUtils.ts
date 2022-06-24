import type { ZodError } from "zod";
import { None, Opt, RsOption } from "../../shared";

function handlePaths(paths: (string | number)[]) {
  let res = "";
  for (let i = 0; i < paths.length; i++) {
    const el = paths[i];
    if (typeof el === "string") {
      res = res + el;
    }
    if (typeof el === "number") {
      res = res + `[${el}]`;
    }
    if (i < paths.length - 1) {
      res = res + ".";
    }
  }
  return res;
}

export function formatZodMsg(
  err: ZodError,
  ctxStr: RsOption<string> = None()
): string {
  const issue = Opt(err.issues[0]).expect("A zod error should have an issue");

  let field = "";
  if (issue.path.length) {
    field = `At ${handlePaths(issue.path)}, `;
  }
  return `${ctxStr.unwrapOr(" ")}a zod validation err: ${field}${
    issue.message
  }`;
}
