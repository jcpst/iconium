var crypto = require('crypto')
var path = require('path')
var sh = require('shelljs')

exports.generateAesKey = function () {
  return crypto.randomBytes(32).toString('base64')
}

exports.encrypt = function (text, token) {
  var cipher = crypto.createCipher('aes-256-cbc', sh.cat(token))
  var crypted = cipher.update(text, 'utf8', 'base64')
  crypted += cipher.final('base64')
  return crypted
}

exports.decrypt = function (text, token) {
  var decipher = crypto.createDecipher('aes-256-cbc', sh.cat(token))
  var dec = decipher.update(text, 'base64', 'utf8')
  dec += decipher.final('utf8')
  return dec
}

