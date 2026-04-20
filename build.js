#!/usr/bin/env node

// Set Node.js options to suppress deprecation warnings
process.env.NODE_OPTIONS = '--no-deprecation';
process.env.NODE_NO_WARNINGS = '1';

// Run the actual build command
const { spawn } = require('child_process');
const path = require('path');

const buildProcess = spawn('npx', ['react-scripts', 'build'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

buildProcess.on('exit', (code) => {
  process.exit(code);
});
