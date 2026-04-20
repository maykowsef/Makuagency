#!/usr/bin/env node

// Set Node.js options to suppress deprecation warnings BEFORE any imports
process.env.NODE_OPTIONS = '--no-deprecation';
process.env.NODE_NO_WARNINGS = '1';

// Clear any existing require cache to ensure fresh module loading
delete require.cache[require.resolve('child_process')];

// Run the actual build command
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting build with NODE_OPTIONS:', process.env.NODE_OPTIONS);

const buildProcess = spawn('npm', ['run', 'build:react'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname,
  env: {
    ...process.env,
    NODE_OPTIONS: '--no-deprecation',
    NODE_NO_WARNINGS: '1'
  }
});

buildProcess.on('exit', (code) => {
  process.exit(code);
});
