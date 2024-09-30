// coding-service/workers/codeExecutionWorker.js
const Queue = require("bull");
const { VM } = require("vm2");

const codeExecutionQueue = new Queue("code-execution", process.env.REDIS_URL);

codeExecutionQueue.process(async (job) => {
  const { code, testCases } = job.data;

  const vm = new VM({
    timeout: 5000,
    sandbox: {},
  });

  const results = [];

  for (const testCase of testCases) {
    try {
      const result = vm.run(`
        ${code}
        solve(${testCase.input})
      `);
      results.push({
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: result,
        passed: result.toString() === testCase.expectedOutput,
      });
    } catch (error) {
      results.push({
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: "Error",
        passed: false,
        error: error.message,
      });
    }
  }

  const passed = results.every((result) => result.passed);

  return {
    passed,
    results,
  };
});
