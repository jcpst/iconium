#!/usr/bin/env node

var crypto = require('crypto')
var EOL = require('os').EOL
var sh = require('shelljs')
var argv = require('yargs')
var privacy = require('./lib/privacy.js')
var main = require('./lib/privacy.js')
var VERSION = require('./package.json').version

var privateToken = 'kite.aes'
var services, steps

function steps(serviceFile, stepsFile) {
  services = main.loadYaml(serviceFile)
  steps = main.loadYaml(stepsFile)
}

// ----------------------------------------------------------------------------
// CLI Configuration
// ----------------------------------------------------------------------------
argv.usage('Usage:' + EOL + '  $0 <command> [options]')

argv.command('version', '', function () {
  console.log(VERSION)
})

argv.command('generate', 'Generate new private token.', function (yargs) {
  argv = yargs.option('f', {
    alias: 'file',
    default: privateToken,
    description: 'Filename to write key to.' 
  }).help('h')
    .alias('h', 'help')
    .argv
  privacy.generateAesKey().to(argv.file)
})

argv.command('encrypt', 'Encrypt a file.', function (yargs) {
  argv = yargs
    .option('i', {
      alias: 'input',
      description: 'File to encrypt.' 
    })
    .option('o', {
      alias: 'output',
      description: 'Name of output file.' 
    })
    .option('t', {
      alias: 'token',
      default: privateToken,
      description: 'Path to your token file' 
    })
    .demand(['i', 'o'])
    .help('h').alias('h', 'help')
    .argv
  privacy.encrypt(sh.cat(argv.input), argv.token).to(argv.output)
})

argv.command('decrypt', 'Decrypt a file.', function (yargs) {
  argv = yargs
    .option('i', {
      alias: 'input',
      description: 'File to decrypt.'
    })
    .option('o', {
      alias: 'output',
      description: 'Name of output file.'
    })
    .option('t', {
      alias: 'token',
      default: privateToken,
      description: 'Path to your token file'
    })
    .demand(['i', 'o'])
    .help('h').alias('h', 'help')
    .argv
  privacy.decrypt(sh.cat(argv.input), argv.token).to(argv.output)
})

argv.command('steps', 'Run your steps.', function (yargs) {
  argv = yargs.help('h').alias('h', 'help').argv
  steps('kite-services.yml', 'kite-steps.yml')
})

argv.command('run', 'Run a docker service.', function (yargs) {
  argv = yargs.help('h').alias('h', 'help').argv
})

argv.command('load', 'Pull an image or build a docker service.', function (yargs) {
  argv = yargs.help('h').alias('h', 'help').argv
})

argv.help('h').alias('h', 'help')
argv.epilog('Use "kite [command] (-h|--help)" for more information.')
argv.argv

