export function sleep(millisecs: number): Promise<void> {
  return new Promise((res, _rej) => {
    setTimeout(() => {
      res();
    }, millisecs);
  });
}
