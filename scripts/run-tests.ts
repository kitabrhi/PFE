#!/usr/bin/env ts-node

// Script de lancement configurable via la variable RUNNER.
//
// Usage :
//   RUNNER=cypress    ts-node scripts/run-tests.ts
//   RUNNER=playwright ts-node scripts/run-tests.ts
//
// Options : SPEC, APP_VERSION, BASE_URL

import { execSync } from 'child_process';

const runner = (process.env.RUNNER || 'cypress').toLowerCase();
const spec = process.env.SPEC || '';

function run(cmd: string): void {
  console.log(`\n▶ ${cmd}\n`);
  execSync(cmd, { stdio: 'inherit', env: { ...process.env } });
}

switch (runner) {
  case 'cypress': {
    const specArg = spec ? ` --spec "${spec}"` : '';
    run(`npx cypress run${specArg}`);
    break;
  }

  case 'playwright': {
    const pathsArg = spec ? ` --paths "${spec}"` : '';
    run(`npx cucumber-js --config playwright/cucumber.cjs${pathsArg}`);
    break;
  }

  default:
    console.error(`Runner inconnu : "${runner}". Utilisez RUNNER=cypress ou RUNNER=playwright.`);
    process.exit(1);
}
