#!/usr/bin/env node

/**
 * @fileoverview Main CLI that is run via the readable command.
 * @author Denys Potapov
 */

/* eslint no-console:off */

const init = process.argv.includes('--init');

const configLoader = require('../src/config-loader');
const lint = require('../src/lint');

process.on('uncaughtException', (err) => {
  // TODO: check why it catches not all exceptions
  console.error('Something unexpected happend');
  console.error(err.stack);
  process.exitCode = 2;
});

function run() {
  let config = {};
  try {
    config = configLoader.load();
  } catch (err) {
    console.error(`Can't load config ${configLoader.fileName}`);
    console.error(err.message);
    return 2;
  }

  const errors = lint(config);
  if (errors.length === 0) {
    return 0;
  }

  errors.forEach((e) => console.error(`${e.path}: ${e.message}`));
  return 1;
}

if (init) {
  configLoader.init();
  console.info(`Created default config in ${configLoader.fileName}`);
} else {
  process.exitCode = run();
}
