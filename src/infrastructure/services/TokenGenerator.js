const crypto = require('crypto');
class TokenGenerator {
    generateToken(bytes = 32) {
        return crypto.randomBytes(bytes).toString('hex');
    }

    generateNumericCode(length = 6) {
        return Math.floor(Math.random() * Math.pow(10, length))
            .toString()
            .padStart(length, '0');
    }
}
module.exports = TokenGenerator;