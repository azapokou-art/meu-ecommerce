class PasswordResetTokenRepository {
    async create(tokenData) {
        throw new Error('Method not implemented');
    }
    async findByToken(token) {
        throw new Error('Method not implemented');
    }
    async findValidToken(token) {
        throw new Error('Method not implemented');
    }
    async markAsUsed(token) {
        throw new Error('Method not implemented');
    }
    async invalidate(token) {
        throw new Error('Method not implemented');
    }
    async deleteExpiredTokens() {
        throw new Error('Method not implemented');
    }
}
module.exports = PasswordResetTokenRepository;