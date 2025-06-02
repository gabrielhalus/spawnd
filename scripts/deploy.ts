// scripts/deploy.ts
import { existsSync, mkdirSync } from "fs";
import {
  logError,
  logInfo,
  logSection,
  logSuccess,
  remoteHost,
  remotePath,
  remoteUser,
} from "./utils";

const args = Bun.argv.slice(2); // skip "bun", "run", "scripts/deploy.ts"
const subcommand = args[0];

const exclude = ["uploads", "logs", ".env", "data"];

const localServerFiles = [
  "src",
  "scripts/migrate.ts",
  "drizzle",
  "bun.lock",
  "package.json",
  "tsconfig.json",
  "Dockerfile",
  "compose.yml",
];

const localClientFiles = ["frontend/dist", "frontend/public"];

function ensureLocalDirsExist() {
  const requiredDirs: string[] = [...localServerFiles, ...localClientFiles];
  for (const dir of requiredDirs) {
    if (!existsSync(dir)) {
      logInfo(`Directory '${dir}' does not exist. Creating...`);
      mkdirSync(dir, { recursive: true });
      logSuccess(`Created missing directory: ${dir}`);
    }
  }
}

async function ensureRemoteDirsExist() {
  logSection("Ensuring remote path exist");

  const dirs = [`${remotePath}`];
  const mkdirCmd = dirs.map(dir => `mkdir -p '${dir}'`).join(" && ");

  const proc = Bun.spawn(["ssh", `${remoteUser}@${remoteHost}`, mkdirCmd], {
    stdout: "pipe",
    stderr: "pipe",
  });

  await proc.exited;

  if (proc.exitCode !== 0)
    throw new Error("Failed to ensure remote directories.");
  logSuccess("Remote directories ensured.");
}

async function cleanRemote() {
  logSection("Cleaning remote directory");
  await ensureRemoteDirsExist();

  logInfo(`Target: ${remotePath}`);
  logInfo(`Exclusions: ${exclude.join(", ")}`);

  const excludeArgs = exclude.map(name => `! -name '${name}'`).join(" ");
  const cleanCmd = `cd ${remotePath} && find . -mindepth 1 -maxdepth 1 ${excludeArgs} -exec rm -rf {} +`;

  const proc = Bun.spawn(["ssh", `${remoteUser}@${remoteHost}`, cleanCmd], {
    stdout: "pipe",
    stderr: "pipe",
  });

  await proc.exited;

  if (proc.exitCode !== 0) throw new Error("Failed to clean remote directory.");
  logSuccess("Remote path cleaned.");
}

async function pushFiles() {
  logSection("Pushing files to remote");
  ensureLocalDirsExist();

  const push = async (label: string, files: string[], dest: string) => {
    logInfo(`${label} → ${remoteUser}@${remoteHost}:${dest}`);
    const args = ["-avR", ...files, `${remoteUser}@${remoteHost}:${dest}`];

    const proc = Bun.spawn(["rsync", ...args], {
      stdout: "pipe",
      stderr: "pipe",
    });

    await proc.exited;

    if (proc.exitCode !== 0)
      throw new Error(`Failed to push ${label.toLowerCase()}.`);
    logSuccess(`${label} pushed.`);
  };

  await push("Server files", localServerFiles, remotePath);
  await push("Frontend files", localClientFiles, `${remotePath}`);
}

async function dockerRestart() {
  logSection("Restarting Docker");

  const sshCommand = `cd ${remotePath} && docker compose restart`;

  const proc = Bun.spawn(["ssh", `${remoteUser}@${remoteHost}`, sshCommand], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const stdout = await Bun.readableStreamToText(proc.stdout!);
  const stderr = await Bun.readableStreamToText(proc.stderr!);

  await proc.exited;

  if (proc.exitCode !== 0) {
    logError("Docker restart failed.");
    if (stderr) logError(`Error output:\n${stderr}`);
    throw new Error("Docker restart failed.");
  }
  logSuccess("Docker restarted.");
}

async function dockerUp() {
  logSection("Stopping and starting Docker (down + up --build -d)");

  const sshCommand = `cd ${remotePath} && docker compose down && docker compose up --build -d`;

  const proc = Bun.spawn(["ssh", `${remoteUser}@${remoteHost}`, sshCommand], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const stdout = await Bun.readableStreamToText(proc.stdout!);
  const stderr = await Bun.readableStreamToText(proc.stderr!);

  await proc.exited;

  if (proc.exitCode !== 0) {
    logError("Docker up command failed.");
    if (stderr) logError(`Error output:\n${stderr}`);
    throw new Error("Docker up command failed.");
  }
  logSuccess("Docker containers stopped and restarted.");
}

async function dockerDown() {
  logSection("Stopping Docker containers");

  const sshCommand = `cd ${remotePath} && docker compose down`;

  const proc = Bun.spawn(["ssh", `${remoteUser}@${remoteHost}`, sshCommand], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const stdout = await Bun.readableStreamToText(proc.stdout!);
  const stderr = await Bun.readableStreamToText(proc.stderr!);

  await proc.exited;

  if (proc.exitCode !== 0) {
    logError("Docker down command failed.");
    if (stderr) {
      logError(`Error output:\n${stderr}`);
    }
    throw new Error("Docker down command failed.");
  }
  logSuccess("Docker containers stopped.");
}

async function deploy() {
  logSection("Starting full deployment");
  await cleanRemote();
  await pushFiles();
  await dockerUp();
  logSuccess("Deployment complete.");
}

// --- Dispatcher ---
(async () => {
  try {
    switch (subcommand) {
      case undefined:
      case "deploy":
        await deploy();
        break;
      case "clean":
        await cleanRemote();
        break;
      case "push":
        await pushFiles();
        break;
      case "restart":
        await dockerRestart();
        break;
      case "down":
        await dockerUp();
        break;
      default:
        logError(`Unknown subcommand: ${subcommand}`);
        console.log("\nUsage:");
        console.log("  bun run scripts/deploy.ts [deploy|clean|push|restart]");
        process.exit(1);
    }
  } catch (err) {
    logError(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
})();
