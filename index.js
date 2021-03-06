#!/usr/bin/env node

var EOL = require('os').EOL
var sh = require('shelljs')
var argv = require('yargs')
var privacy = require('./lib/privacy.js')
var VERSION = require('./package.json').version
var PRIVATE_TOKEN = 'iconium.aes'

argv.usage('Usage:' + EOL + '  $0 <command> [options]')

/* ****************************************************************************
 * Generate
 * ***************************************************************************/
argv.command('generate', 'Generate new private token.', function (yargs) {
  argv = yargs
    .option('f', {
      alias: 'file',
      default: PRIVATE_TOKEN,
      description: 'Filename to write key to.'
    })
    .help('h').alias('h', 'help')
    .argv
  privacy.generateAesKey().to(argv.file)
})

/* ****************************************************************************
 * Encrypt
 * ***************************************************************************/
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
      default: PRIVATE_TOKEN,
      description: 'Path to your token file'
    })
    .demand(['i', 'o'])
    .help('h').alias('h', 'help')
    .argv
  privacy.encrypt(sh.cat(argv.input), sh.cat(argv.token)).to(argv.output)
})

/* ****************************************************************************
 * Decrypt
 * ***************************************************************************/
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
      default: PRIVATE_TOKEN,
      description: 'Path to your token file'
    })
    .demand(['i', 'o'])
    .help('h').alias('h', 'help')
    .argv
  privacy.decrypt(sh.cat(argv.input), sh.cat(argv.token)).to(argv.output)
})

/* ****************************************************************************
 * Steps
 * ***************************************************************************/
argv.command('steps', 'Run your steps.', function (yargs) {
  argv = yargs
    .option('ci', {
      default: false,
      description: 'Whether or not this build is running under CI.'
    })
    .option('ci-branch', {
      description: 'Name of the branch.'
    })
    .option('ci-build-id', {
      description: 'Id of the build being run.'
    })
    .option('ci-commit-description', {
      description: 'Short description of the current commit.'
    })
    .option('ci-commit-id', {
      description: 'The SHA of the commit being built.'
    })
    .option('ci-commit-message', {
      description: 'The message of the commit being built.'
    })
    .option('ci-committer-email', {
      description: 'The email of the committer.'
    })
    .option('ci-committer-name', {
      description: 'The name of the committer.'
    })
    .option('ci-committer-username', {
      description: 'The username of the committer.'
    })
    .option('ci-name', {
      description: 'The name of the CI system.'
    })
    .option('ci-project-id', {
      description: 'The id of the project being built.'
    })
    .option('ci-repo-name', {
      description: 'The name of the scm repository being built.'
    })
    .option('debug', {
      default: false,
      description: 'Turn debug output on.'
    })
    .option('dir', {
      description: 'The directory to use'
    })
    .option('encrypted-dockercfg-path', {
      description: 'Path to the encrypted dockercfg file to be used.'
    })
    .option('e', {
      alias: 'env',
      description: 'Set an environment variable. (Can use multiple times)'
    })
    .option('key-path', {
      description: 'key for encrypting environment variables.',
      default: PRIVATE_TOKEN
    })
    .option('steps-path', {
      default: 'iconium-steps.yml',
      description: 'Path to steps.yml file.'
    })
    .option('services-path', {
      default: 'iconium-services.yml',
      description: 'Path to services.yml file.'
    })
    .help('h').alias('h', 'help')
    .argv
})

/* ****************************************************************************
 * Run
 * ***************************************************************************/
argv.command('run', 'Run a docker service.', function (yargs) {
  argv = yargs.help('h').alias('h', 'help').argv
})

/* ****************************************************************************
 * Load
 * ***************************************************************************/
argv.command('load', 'Pull an image or build a docker service.', function (yargs) {
  argv = yargs.help('h').alias('h', 'help').argv
})

argv.help('h').alias('h', 'help')
argv.version(VERSION, 'v').alias('v', 'version')
argv.getOptions().boolean.splice(-2)
argv.epilog('Use "kite [command] (-h|--help)" for more information.')
argv.argv

