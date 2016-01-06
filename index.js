#!/usr/bin/env node

var crypto = require('crypto')
var path = require('path')
var EOL = require('os').EOL
var sh = require('shelljs')
var privacy = require('./lib/privacy.js')
var main = require('./lib/privacy.js')
var VERSION = require('./package.json').version

var privateToken = path.join(__dirname, 'kite.aes')
var services, steps

function steps(serviceFile, stepsFile) {
  services = main.loadYaml(serviceFile)
  steps = main.loadYaml(stepsFile)
}

// ----------------------------------------------------------------------------
// CLI Configuration
// ----------------------------------------------------------------------------
var argv = require('yargs')
  .usage('Usage:' + EOL + '  $0 <command> [options]')

  .command('version', '', function () {
    console.log(VERSION)
  })

  // --------------------------------------------------------------------------
  // Crypto.
  // --------------------------------------------------------------------------
  .command('generate', 'Generate new private token.', function (yargs) {
    argv = yargs.option('f', {
      alias: 'file',
      default: 'kite.aes',
      description: 'Filename to write key to.' })
    .help('h')
    .alias('h', 'help')
    .argv
    privacy.generateAesKey().to(argv.file)
  })

  .command('encrypt', 'Encrypt a file.', function (yargs) {
    argv = yargs
      .option('i', {
        alias: 'input',
        description: 'File to encrypt.' })
      .option('o', {
        alias: 'output',
        description: 'Name of output file.' })
      .option('t', {
        alias: 'token',
        description: 'Path to your token file' })
      .demand(['i', 'o'])
      .help('h')
      .alias('h', 'help')
      .argv
    var token = argv.token || privateToken
    privacy.encrypt(sh.cat(argv.input), token).to(argv.output)
  })

  .command('decrypt', 'Decrypt a file.', function (yargs) {
    argv = yargs
      .option('i', {
        alias: 'input',
        description: 'File to decrypt.' })
      .option('o', {
        alias: 'output',
        description: 'Name of output file.' })
      .option('t', {
        alias: 'token',
        description: 'Path to your token file' })
      .demand(['i', 'o'])
      .help('h')
      .alias('h', 'help')
      .argv
    var token = argv.token || privateToken
    privacy.decrypt(sh.cat(argv.input), token).to(argv.output)
  })

  // --------------------------------------------------------------------------
  // Build.
  // --------------------------------------------------------------------------
  .command('steps', 'Run your steps.', function (yargs) {
    argv = yargs.help('h').alias('h', 'help').argv
    steps('kite-services.yml', 'kite-steps.yml')
  })

  .command('run', 'Run a docker service.', function (yargs) {
    argv = yargs.help('h').alias('h', 'help').argv
  })

  .command('load', 'Pull an image or build a docker service.', function (yargs) {
    argv = yargs.help('h').alias('h', 'help').argv
  })

  .default('h')
  .help('h')
  .alias('h', 'help')
  .epilog('Use "kite [command] (-h|--help)" for more information about a command.')
  .argv

