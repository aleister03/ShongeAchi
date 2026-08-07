import { spawn } from "node:child_process";
import mongoose from "mongoose";

const command = process.argv[2];
const args = process.argv.slice(3);
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Startup aborted: MONGODB_URI is not configured.");
  process.exit(1);
}

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  await mongoose.disconnect();
} catch (error) {
  console.error(`Startup aborted: MongoDB connection failed: ${error.message}`);
  process.exit(1);
}

const nextBin = new URL("../node_modules/next/dist/bin/next", import.meta.url).pathname;
const child = spawn(process.execPath, [nextBin, command, ...args], { stdio: "inherit", env: process.env });

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("exit", (code, signal) => {
  process.exitCode = signal ? 1 : code;
});
