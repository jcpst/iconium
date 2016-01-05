require('shelljs/global')

var crypto = require('crypto')
var path = require('path')
var packageJson = require('./package.json')
var privateToken = path.join(__dirname, 'kite.aes')

function generateAesKey(file) {
  crypto.randomBytes(32).toString('base64').to(file)
}

function encrypt(text, token) {
  var cipher = crypto.createCipher('aes-256-cbc', cat(token))
  var crypted = cipher.update(text,'utf8','base64')
  crypted += cipher.final('base64');
  return crypted
}

function decrypt(text, token) {
  var decipher = crypto.createDecipher('aes-256-cbc', cat(token))
  var dec = decipher.update(text,'base64','utf8')
  dec += decipher.final('utf8');
  return dec;
}

//-----------------------------------------------------------------------------
// CLI Configuration
//-----------------------------------------------------------------------------

var argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  
  .command('generate', 'Generate new private token.', function (yargs) {
    argv = yargs.option('f', {
      alias: 'file',
      default: 'kite.aes',
      description: 'Filename to write key to.'
    })
    .help('h')
    .alias('h', 'help')
    .argv
    generateAesKey(argv.file)
  })
  
  .command('encrypt', 'Encrypt a file.', function (yargs) {
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
        description: 'Path to your token file'
      })
      .demand(['i', 'o'])
      .help('h')
      .alias('h', 'help')
      .argv
    var token = argv.token || privateToken
    encrypt(cat(argv.input), token).to(argv.output)
  })
  
  .command('decrypt', 'Decrypt a file.', function (yargs) {
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
        description: 'Path to your token file'
      })
      .demand(['i', 'o'])
      .help('h')
      .alias('h', 'help')
      .argv
    var token = argv.token || privateToken
    decrypt(cat(argv.input), token).to(argv.output)
  })

  .example('$0 generate -f kite.aes', 'Create new token file')
  .help('h')
  .alias('h', 'help')
  .epilog('Version:  ' + packageJson.version)
  .argv

