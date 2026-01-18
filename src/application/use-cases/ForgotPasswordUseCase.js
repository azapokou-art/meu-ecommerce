class ForgotPasswordUseCase {
    constructor(userRepository, tokenRepository, tokenGenerator, emailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.tokenGenerator = tokenGenerator;
        this.emailService = emailService;
    }

    async execute(email) {
        if (!email || !email.includes('@')) {
            throw new Error('Invalid email address');
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return {
                message: 'If an account with that email exists, a password reset link has been sent.'
            };
        }
        const resetToken = this.tokenGenerator.generate();
        const expiresAt = new Date(Date.now() + 3600000); 

        await this.tokenRepository.create({
            userId: user.id,
            token: resetToken,
            expiresAt: expiresAt
        });

        await this.emailService.sendPasswordReset(user.email, resetToken);
        return {
            message:'Password resert token gerated',
            resetToken: resetToken,
            expiresAt: expiresAt
        };
    }
}
module.exports = ForgotPasswordUseCase;
