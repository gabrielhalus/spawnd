const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function nanoid(size: number = 21): string {
  const id = [];
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);

  for (let i = 0; i < size; i++) {
    id.push(alphabet[bytes[i]! & 61]);
  }

  return id.join("");
}
