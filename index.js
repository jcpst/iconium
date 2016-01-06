#!/usr/bin/env node

var crypto = require('crypto')
var fs = require('fs')
var path = require('path')
var EOL = require('os').EOL
var Docker = require('dockerode')
var yaml = require('js-yaml')
var sh = require('shelljs')
var VERSION = require('./package.json').version

var privateToken = path.join(__dirname, 'kite.aes')
var services, steps

function generateAesKey (file) {
  crypto.randomBytes(32).toString('base64').to(file)
}

function encrypt(text, token) {
  var cipher = crypto.createCipher('aes-256-cbc', sh.cat(token))
  var crypted = cipher.update(text, 'utf8', 'base64')
  crypted += cipher.final('base64')
  return crypted
}

function decrypt(text, token) {
  var decipher = crypto.createDecipher('aes-256-cbc', sh.cat(token))
  var dec = decipher.update(text, 'base64', 'utf8')
  dec += decipher.final('utf8')
  return dec
}


// TODO: STEPS
// x load yaml
// . run service based on yml config
// . call service by step
// . run each step
function dockerBuild() {}
function runStep(stepName) {}
function runService() {}

function loadYaml(file) {
  try {
    return yaml.safeLoad(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    console.log('didnt work: ' + e)
    return ''
  }
}

function steps(serviceFile, stepsFile) {
  services = loadYaml(serviceFile)
  steps = loadYaml(stepsFile)
}

// ----------------------------------------------------------------------------
// CLI Configuration
// ----------------------------------------------------------------------------
var argv = require('yargs')
  .usage('Usage:' + EOL + '  $0 <command> [options]')

  .command('version', '', console.log(VERSION))

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
    generateAesKey(argv.file)
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
    encrypt(sh.cat(argv.input), token).to(argv.output)
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
    decrypt(sh.cat(argv.input), token).to(argv.output)
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

