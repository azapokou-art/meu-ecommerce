const jwt = require('jsonwebtoken');
class TokenService {
    constructor(secret) {
        this.secret = secret || process.env.JWT_SECRET;
    }

    generate(payload, options = {}) {
        return jwt.sign(payload, this.secret, { expiresIn: '24h', ...options });
    }
    verify(token) {
        return jwt.verify(token, this.secret);
    }
}

module.exports = TokenService;