const Docker = require("dockerode");
const fs = require("fs").promises;
const path = require("path");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const Submission = require("../models/Submission");

const docker = new Docker();

const languageConfigs = {
  cpp: {
    image: "gcc:latest",
    cmd: ["g++", "-std=c++17", "main.cpp", "-o", "main", "&&", "./main"],
  },
  java: {
    image: "openjdk:latest",
    cmd: ["javac", "Main.java", "&&", "java", "Main"],
  },
  python: { image: "python:latest", cmd: ["python", "main.py"] },
  javascript: { image: "node:latest", cmd: ["node", "main.js"] },
};

async function runCode(submissionId, testCases, language, code) {
  const submission = await Submission.findById(submissionId);
  if (!submission) throw new Error("Submission not found");

  const tempDir = await fs.mkdtemp(path.join("/tmp", "code-"));
  const codePath = path.join(
    tempDir,
    `main.${language === "java" ? "java" : language}`
  );
  await fs.writeFile(codePath, code);

  const config = languageConfigs[language];

  let allTestsPassed = true;
  let runtime = 0;
  let memory = 0;

  for (const testCase of testCases) {
    const container = await docker.createContainer({
      Image: config.image,
      Cmd: config.cmd,
      HostConfig: {
        Memory: 512 * 1024 * 1024, // 512 MB
        MemorySwap: 512 * 1024 * 1024, // 512 MB
        NanoCpus: 1 * 1000000000, // 1 CPU
        NetworkMode: "none",
      },
      WorkingDir: "/app",
      Tty: true,
    });

    await container.start();

    const exec = await container.exec({
      Cmd: ["sh", "-c", `echo "${testCase.input}" | ${config.cmd.join(" ")}`],
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start();
    let output = "";
    stream.on("data", (chunk) => {
      output += chunk.toString();
    });

    await new Promise((resolve) => stream.on("end", resolve));

    const stats = await container.stats({ stream: false });
    runtime = Math.max(runtime, stats.cpu_stats.cpu_usage.total_usage);
    memory = Math.max(memory, stats.memory_stats.usage);

    await container.stop();
    await container.remove();

    if (output.trim() !== testCase.expectedOutput.trim()) {
      allTestsPassed = false;
      break;
    }
  }

  await fs.rmdir(tempDir, { recursive: true });

  submission.status = allTestsPassed ? "Accepted" : "Wrong Answer";
  submission.runtime = runtime;
  submission.memory = memory;
  await submission.save();
}

module.exports = { runCode };
