class EmailService {
    async sendPasswordReset(email, token) {
        console.log(`[EMAIL] Password reset token for ${email}: ${token}`);
    }
}
module.exports = EmailService;