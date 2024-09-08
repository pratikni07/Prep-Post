const Docker = require("dockerode");
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

class CodeExecutionService {
  constructor() {
    this.docker = new Docker();
  }

  async executeCode(code, language, testCases, isSubmission = false) {
    const containerId = uuidv4();
    const containerName = `code-execution-${containerId}`;
    const maxTestCases = isSubmission
      ? testCases.length
      : Math.min(3, testCases.length);

    try {
      // Create a temporary directory for the code and test cases
      const tempDir = path.join(__dirname, "..", "temp", containerId);
      await fs.mkdir(tempDir, { recursive: true });

      // Write the code to a file
      const codeFile = path.join(
        tempDir,
        `code.${this.getFileExtension(language)}`
      );
      await fs.writeFile(codeFile, code);

      // Prepare the Docker container
      const container = await this.docker.createContainer({
        Image: this.getDockerImage(language),
        name: containerName,
        Cmd: this.getExecutionCommand(language, codeFile),
        HostConfig: {
          Binds: [`${tempDir}:/app`],
          Memory: 128 * 1024 * 1024, // 128 MB
          MemorySwap: 128 * 1024 * 1024, // 128 MB
          NanoCPUs: 1 * 1000000000, // 1 CPU
        },
      });

      // Start the container
      await container.start();

      // Run test cases
      const results = await Promise.all(
        testCases.slice(0, maxTestCases).map(async (testCase, index) => {
          const { input, expectedOutput } = testCase;
          const outputFile = path.join(tempDir, `output_${index}.txt`);

          // Write input to a file
          await fs.writeFile(path.join(tempDir, `input_${index}.txt`), input);

          // Execute the code with the input
          await container.exec({
            Cmd: [
              "sh",
              "-c",
              `${this.getExecutionCommand(
                language,
                codeFile
              )} < input_${index}.txt > output_${index}.txt`,
            ],
            AttachStdout: true,
            AttachStderr: true,
          });

          // Read the output
          const output = await fs.readFile(outputFile, "utf-8");

          return {
            input,
            expectedOutput,
            actualOutput: output.trim(),
            passed: output.trim() === expectedOutput.trim(),
          };
        })
      );

      // Stop and remove the container
      await container.stop();
      await container.remove();

      // Clean up temporary files
      await fs.rmdir(tempDir, { recursive: true });

      return results;
    } catch (error) {
      console.error("Error executing code:", error);
      throw new Error("Code execution failed");
    }
  }

  getFileExtension(language) {
    const extensions = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
    };
    return extensions[language] || "txt";
  }

  getDockerImage(language) {
    const images = {
      javascript: "node:14",
      python: "python:3.9",
      java: "openjdk:11",
      cpp: "gcc:latest",
    };
    return images[language] || "alpine";
  }

  getExecutionCommand(language, file) {
    const commands = {
      javascript: ["node", file],
      python: ["python", file],
      java: ["java", file],
      cpp: ["g++", file, "-o", "app", "&&", "./app"],
    };
    return commands[language] || ["sh", "-c", `cat ${file}`];
  }
}

module.exports = new CodeExecutionService();
