import { None, RsOption, Some } from "../RsOption";

export class RsResult<T extends {}, E extends {}> {
  private value: T | null | undefined;
  private error: E | null | undefined;

  /** SHOULD NOT CALL CONSTRUCTOR, use Ok or Err instead, if it is unknown,
   * create an RsOption then map it to a RsResult
   */
  constructor(n: { value?: T; err?: E }) {
    if (typeof n.value === "undefined" && typeof n.err === "undefined") {
      throw new Error("Tried to create error with both undefined fields");
    }
    if (typeof n.value !== "undefined" && typeof n.err !== "undefined") {
      throw new Error("Tried to create error with both valid fields");
    }
    if (typeof n.value !== "undefined") {
      this.error = undefined;
      this.value = n.value;
    } else {
      this.error = n.err;
      this.value = undefined;
    }
  }
  private isValid(checkee: T | null | undefined): checkee is T {
    return checkee !== undefined && checkee !== null;
  }

  isOk() {
    return this.isValid(this.value);
  }

  isErr() {
    return !this.isValid(this.value);
  }

  unwrap(): T {
    if (this.isOk()) {
      return this.value!;
    }
    throw new Error("Unwrap called on a null/undefined value");
  }

  unwrapErr(): E {
    if (this.isErr()) {
      return this.error!;
    }
    throw new Error("Unwrap Error called on a Ok value");
  }

  unwrapOr(alt: T): T {
    if (this.isOk()) {
      return this.value!;
    }
    return alt;
  }

  expect(msg: string): T {
    if (this.isOk()) {
      return this.value!;
    }
    throw new Error(msg);
  }

  ok(): RsOption<T> {
    if (this.isOk()) {
      return Some(this.value!);
    }
    return None();
  }

  err(): RsOption<E> {
    if (this.isErr()) {
      return Some(this.error!);
    }
    return None();
  }

  map<K>(f: (value: T) => K): RsResult<K, E> {
    if (this.isOk()) {
      return Ok<K>(f(this.value!));
    }
    return Err(this.error!);
  }

  mapErr<K>(f: (value: E) => K): RsResult<T, K> {
    if (this.isErr()) {
      return Err(f(this.error!));
    }
    return Ok(this.value!);
  }
}

export function Ok<T extends {}>(n: T) {
  return new RsResult<T, any>({ value: n });
}

export function Err<E extends {}>(e: E) {
  return new RsResult<any, E>({ err: e });
}
