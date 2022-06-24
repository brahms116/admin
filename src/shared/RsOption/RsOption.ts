import { Err, Ok, RsResult } from "../RsResult";

export class RsOption<T extends {}> {
  private value: T | null | undefined;
  constructor(value?: T | null | undefined) {
    this.value = value;
  }
  private isValid(checkee: T | null | undefined): checkee is T {
    return checkee !== undefined && checkee !== null;
  }

  isSome() {
    return this.isValid(this.value);
  }

  isNone() {
    return !this.isValid(this.value);
  }

  unwrap(): T {
    if (this.isSome()) {
      return this.value!;
    }
    throw new Error("Unwrap called on a null/undefined value");
  }

  expect(msg: string): T {
    if (this.isSome()) {
      return this.value!;
    }
    throw new Error(msg);
  }

  unwrapOr(alt: T): T {
    if (this.isSome()) {
      return this.value!;
    }
    return alt;
  }

  map<K>(func: (value: T) => K): RsOption<K> {
    if (this.isSome()) {
      return new RsOption(func(this.value!));
    }
    return new RsOption();
  }

  unwrapOrNull(): T | null {
    if (this.isSome()) {
      return this.value!;
    }
    return null;
  }

  okOr<E>(e: E): RsResult<T, E> {
    if (this.isSome()) {
      return Ok(this.value!);
    }
    return Err(e);
  }

  unwrapOrUndefined(): T | undefined {
    if (this.isSome()) {
      return this.value!;
    }
    return undefined;
  }
}

export function Some<T extends {}>(value: T) {
  return new RsOption(value);
}

export function None<T extends {}>() {
  return new RsOption<T>();
}

export function Opt<T extends {}>(n: T | null | undefined) {
  return new RsOption<T>(n);
}
