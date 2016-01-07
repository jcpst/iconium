var privacy = require('../lib/privacy')

var testString = 'Just a value to test with.'
var key = privacy.generateAesKey()
var encryptedValue = privacy.encrypt(testString, key)
var decryptedValue = privacy.decrypt(encryptedValue, key)

function base64Regex() {
  var regex = '(?:[A-Za-z0-9+\/]{4}\\n?)*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)'
  return new RegExp('(?:^' + regex + '$)')
}

describe('generate test key', function () {
  it('is a base64 string', function () {
    expect(key).toMatch(base64Regex())
  })
})

describe('encypting and decrypting', function () {
  it('can encrypt a string', function () {
    expect(encryptedValue).toMatch(base64Regex())
  })
  it('can decrypt a string', function () {
    expect(decryptedValue).toBe(testString)
  })
})

