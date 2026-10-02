"use strict";

const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "vendor", "whisper", "source");
const outputDir = path.join(root, "vendor", "whisper", "bin");
const output = path.join(outputDir, "whisper-cli");
const serverOutput = path.join(outputDir, "whisper-server");
const WHISPER_VERSION = "v1.9.2";

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}

async function main() {
  await fsp.mkdir(path.dirname(sourceDir), { recursive: true });
  if (!fs.existsSync(path.join(sourceDir, ".git"))) {
    run("git", ["clone", "--depth", "1", "--branch", WHISPER_VERSION, "https://github.com/ggml-org/whisper.cpp.git", sourceDir]);
  } else {
    const dirty = spawnSync("git", ["status", "--porcelain"], {
      cwd: sourceDir,
      encoding: "utf8",
    });
    if (dirty.status !== 0 || dirty.stdout.trim()) {
      throw new Error("whisper.cpp source has local changes; refusing to replace them");
    }
    const tag = spawnSync("git", ["rev-parse", "--verify", WHISPER_VERSION], {
      cwd: sourceDir,
      stdio: "ignore",
    });
    if (tag.status !== 0) {
      run("git", ["fetch", "--depth", "1", "origin", "tag", WHISPER_VERSION], sourceDir);
    }
    run("git", ["checkout", "--detach", WHISPER_VERSION], sourceDir);
  }
  run(
    "cmake",
    [
      "-B",
      "build",
      "-DCMAKE_BUILD_TYPE=Release",
      "-DGGML_NATIVE=OFF",
      "-DBUILD_SHARED_LIBS=OFF",
      "-DWHISPER_BUILD_SERVER=ON",
      "-DWHISPER_BUILD_TESTS=OFF",
    ],
    sourceDir,
  );
  run("cmake", ["--build", "build", "--config", "Release", "-j"], sourceDir);
  await fsp.mkdir(outputDir, { recursive: true });
  await fsp.copyFile(path.join(sourceDir, "build", "bin", "whisper-cli"), output);
  await fsp.copyFile(path.join(sourceDir, "build", "bin", "whisper-server"), serverOutput);
  await fsp.chmod(output, 0o755);
  await fsp.chmod(serverOutput, 0o755);
  console.log(`Prepared whisper.cpp ${WHISPER_VERSION} binaries: ${output}, ${serverOutput}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
