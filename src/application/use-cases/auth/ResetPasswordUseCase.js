class ResetPasswordUseCase {
    constructor(passwordResetTokenRepository, userRepository, passwordHasher, passwordValidator) {
        this.tokenRepository = passwordResetTokenRepository;
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.passwordValidator = passwordValidator;
    }
    async execute(token, newPassword) {
        if (!token || !newPassword) {
            throw new Error('Token and new password are required');
        }

        await this.passwordValidator.validate(newPassword);

        const resetToken = await this.tokenRepository.findValidToken(token);
        if (!resetToken) {
            throw new Error('Invalid or expired token');
        }

        if (resetToken.used) {
            throw new Error('Token has already been used');
        }

        const hashedPassword = await this.passwordHasher.hash(newPassword);

        await this.userRepository.updatePassword(resetToken.userId, hashedPassword);

        return { message: 'Password has been reset successfully' };
    }
}
module.exports = ResetPasswordUseCase;




