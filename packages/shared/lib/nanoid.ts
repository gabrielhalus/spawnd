const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-";
const LENGTH = 21;

export function nanoid(size = LENGTH): string {
  let id = "";
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);

  for (let i = 0; i < size; i++) {
    id += ALPHABET[bytes[i] & 63]; // 63 = 00111111 mask to stay in range
  }

  return id;
}
