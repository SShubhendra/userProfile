var crypto = require('crypto');

var SaltLength = 5;

function createHash(password) {
  var salt = generateSalt(SaltLength);
  var hash=md5(md5(password) + salt);
  return {password:hash,salt:salt}
}

function validateHash(hashDb,saltDb,formPassword) {
  console.log("validateHash**********",hashDb,saltDb,formPassword);
  var validHash = md5(md5(formPassword)+saltDb);
  return hashDb === validHash;
}

function generateSalt(len) {
  var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
      setLen = set.length,
      salt = '';
  for (var i = 0; i < len; i++) {
    var p = Math.floor(Math.random() * setLen);
    salt += set[p];
  }
  return salt;
}

function md5(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

module.exports = {
  'createHash': createHash,
  'validate': validateHash
};