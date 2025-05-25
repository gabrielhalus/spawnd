const remoteUserEnv = process.env.REMOTE_USER;
const remoteHostEnv = process.env.REMOTE_HOST;
const remotePathEnv = process.env.REMOTE_PATH;

if (!remoteUserEnv || !remoteHostEnv || !remotePathEnv) {
  console.error("\x1b[31m%s\x1b[0m", "ERROR: Missing REMOTE_USER, REMOTE_HOST, or REMOTE_PATH environment variables.");
  process.exit(1);
}

export const remoteUser = remoteUserEnv;
export const remoteHost = remoteHostEnv;
export const remotePath = remotePathEnv;

// ANSI escape codes for styling
export const styles = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  violet: "\x1b[95m",
  gray: "\x1b[90m",
};

export function color(text: string, colorCode: string) {
  return `${colorCode}${text}${styles.reset}`;
}

export function logSection(title: string) {
  console.log(styles.bold + color(`\n> ${title}`, styles.violet));
}

export function logInfo(msg: string) {
  console.log(color(`  ${msg}`, styles.gray));
}

export function logSuccess(msg: string) {
  console.log(color(`✓ ${msg}`, styles.green));
}

export function logError(msg: string) {
  console.error(color(`⨯ ${msg}`, styles.red));
}
