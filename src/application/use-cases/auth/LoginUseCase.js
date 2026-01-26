class LoginUseCase {
  constructor(userRepository, passwordHasher, tokenService) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.tokenService = tokenService;
    }

    async execute(input) {
        const user = await this.userRepository.findByEmail(input.email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const validPassword = await this.passwordHasher.compare(input.password, user.password);
        if (!validPassword) {
            throw new Error('Invalid email or password');
        }
        const token = this.tokenService.generate({ 
            userId: user.id,
            email: user.email,
            role: user.role
        });
        const { password, ...userWithoutPassword } = user;
        return {
            message: 'Login successful',
            user: userWithoutPassword,
            token: token
        };
    }
}
module.exports = LoginUseCase;