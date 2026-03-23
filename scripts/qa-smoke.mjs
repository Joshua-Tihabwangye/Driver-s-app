import { execSync } from "node:child_process";

const checks = [
  "node scripts/check-route-hygiene.mjs",
  "node scripts/check-ride-regressions.mjs",
  "node scripts/check-shared-workflow.mjs",
];

for (const command of checks) {
  console.log(`\n[RUN] ${command}`);
  execSync(command, { stdio: "inherit" });
}

console.log("\nQA smoke pack passed.");
