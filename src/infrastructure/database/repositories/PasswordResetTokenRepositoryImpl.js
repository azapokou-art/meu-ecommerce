const PasswordResetTokenRepository = require('../../../domain/repositories/PasswordResetTokenRepository');

class PasswordResetTokenRepositoryImpl extends PasswordResetTokenRepository {
    async create(tokenData) {
        const { userId, token, expiresAt } = tokenData;
        const sql = `
            INSERT INTO password_reset_tokens (user_id, token, expires_at)
            VALUES (?, ?, ?)
        `;
        await pool.execute(sql, [userId, token, expiresAt]);
    }
    async findByToken(token) {
        const sql = 'SELECT * FROM password_reset_tokens WHERE token = ? LIMIT 1';
        const [rows] = await pool.execute(sql, [token]);
        return rows[0] || null;
    }

    async findValidToken(token) {
        const sql = `
            SELECT * FROM password_reset_tokens 
            WHERE token = ? AND used = FALSE AND expires_at > NOW()
            LIMIT 1
        `;
        const [rows] = await pool.execute(sql, [token]);
        return rows[0] || null;
    }
    async markAsUsed(tokenId) {
        const sql = `
            UPDATE password_reset_tokens 
            SET used = TRUE, used_at = NOW() 
            WHERE token = ?
        `;
        await pool.execute(sql, [tokenId]);
    }
}
module.exports = PasswordResetTokenRepositoryImpl;