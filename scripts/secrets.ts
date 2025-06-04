import {
  logError,
  logInfo,
  logSection,
  logSuccess,
  remoteHost,
  remotePath,
  remoteUser,
} from "./utils";

const args = Bun.argv.slice(2); // skip "bun", "run", "scripts/secrets.ts"
const subcommand = args[0];
const argument = args[1];

if (!remoteUser || !remoteHost || !remotePath) {
  logError("Missing REMOTE_USER, REMOTE_HOST, or REMOTE_PATH.");
  process.exit(1);
}

if (!subcommand || !argument) {
  logError("Usage:");
  console.log("  bun secrets set VARIABLE='value'");
  console.log("  bun secrets set VARIABLE   # prompts for value");
  console.log("  bun secrets get VARIABLE");
  console.log("  bun secrets remove VARIABLE");
  process.exit(1);
}

// Hidden prompt for sensitive values
function promptHidden(query: string): Promise<string> {
  return new Promise(resolve => {
    process.stdout.write(query);

    let input = "";
    const onData = (chunk: Buffer) => {
      const char = chunk.toString();

      if (char === "\r" || char === "\n") {
        process.stdout.write("\n");
        process.stdin.setRawMode?.(false);
        process.stdin.pause();
        process.stdin.removeListener("data", onData);
        resolve(input);
      } else if (char === "\u0003") {
        // Ctrl+C
        process.stdout.write("\n");
        process.stdin.setRawMode?.(false);
        process.stdin.pause();
        process.stdin.removeListener("data", onData);
        process.exit(130);
      } else if (char === "\x7f") {
        // Backspace
        if (input.length > 0) {
          input = input.slice(0, -1);
          // Erase last '*' from terminal
          process.stdout.write("\b \b");
        }
      } else {
        input += char;
        process.stdout.write("*");
      }
    };

    process.stdin.setRawMode?.(true);
    process.stdin.resume();
    process.stdin.on("data", onData);
  });
}

const [key, ...valueParts] = argument.includes("=")
  ? argument.split("=")
  : [argument];

let value = valueParts.join("=");

if (subcommand === "set" && !value) {
  value = await promptHidden(`Enter value for ${key}: `);
}

function escapeShellValue(val: string): string {
  return `'${val.replace(/'/g, `'\\''`)}'`;
}

async function setEnvValue() {
  if (!key || value === "") {
    logError("Invalid format. Use: VARIABLE='value'");
    process.exit(1);
  }

  const escapedValue = escapeShellValue(value);

  logSection("Updating remote .env");

  const cmd = `
    mkdir -p ${remotePath} && touch ${remotePath}/.env &&
    (grep -q '^${key}=' ${remotePath}/.env &&
      sed -i "s|^${key}=.*|${key}=${escapedValue}|" ${remotePath}/.env ||
      echo "${key}=${escapedValue}" >> ${remotePath}/.env)
  `.trim();

  logInfo(`Setting ${key} on remote`);

  const proc = Bun.spawn(["ssh", `${remoteUser}@${remoteHost}`, cmd]);
  await proc.exited;

  if (proc.exitCode !== 0) {
    logError("Failed to update remote .env file.");
    process.exit(1);
  }

  logSuccess(`.env updated: ${key}`);
}

async function getEnvValue() {
  if (!key) {
    logError("Missing VARIABLE name for get.");
    process.exit(1);
  }

  logSection(`Fetching ${key} from remote .env`);

  const grepCmd = `grep '^${key}=' ${remotePath}/.env | tail -n 1`;
  const proc = Bun.spawn(["ssh", `${remoteUser}@${remoteHost}`, grepCmd], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const output = await new Response(proc.stdout).text();
  await proc.exited;

  if (proc.exitCode !== 0 || !output.trim()) {
    logError(`Variable ${key} not found in remote .env.`);
    process.exit(1);
  }

  const cleaned = output.trim().replace(/^.*?=/, "");
  logSuccess(`${key} = ${cleaned}`);
}

async function removeEnvValue() {
  if (!key) {
    logError("Missing VARIABLE name for remove.");
    process.exit(1);
  }

  logSection(`Removing ${key} from remote .env`);

  const cmd = `
    if [ -f ${remotePath}/.env ]; then
      sed -i "/^${key}=.*/d" ${remotePath}/.env
    fi
  `.trim();

  const proc = Bun.spawn(["ssh", `${remoteUser}@${remoteHost}`, cmd]);
  await proc.exited;

  if (proc.exitCode !== 0) {
    logError(`Failed to remove ${key} from remote .env.`);
    process.exit(1);
  }

  logSuccess(`Removed ${key} from remote .env`);
}

// --- Dispatcher ---
(async () => {
  try {
    switch (subcommand) {
      case "get":
        await getEnvValue();
        break;
      case "set":
        await setEnvValue();
        break;
      case "remove":
        await removeEnvValue();
        break;
      default:
        logError(`Unknown subcommand: ${subcommand}`);
        process.exit(1);
    }
  } catch (err) {
    logError(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
})();
