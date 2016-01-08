/**
 * @description Some functions for handling private environment variables.
 * @author Joseph Post <joe@jcpst.com>
 * @type {exports|module.exports}
 */

var crypto = require('crypto')

/**
 * Generates an AES key.
 */
exports.generateAesKey = function () {
  return crypto.randomBytes(32).toString('base64')
}

/**
 * Encrypts a string.
 * @param {string} text - string to encrypt
 * @param {string} token - key to encrypt with
 */
exports.encrypt = function (text, token) {
  var cipher = crypto.createCipher('aes-256-cbc', token)
  var crypted = cipher.update(text, 'utf8', 'base64')
  crypted += cipher.final('base64')
  return crypted
}

/**
 * Decrypts a string.
 * @param {string} text - string to decrypt
 * @param {string} token - key to decrypt with
 */
exports.decrypt = function (text, token) {
  var decipher = crypto.createDecipher('aes-256-cbc', token)
  var dec = decipher.update(text, 'base64', 'utf8')
  dec += decipher.final('utf8')
  return dec
}

