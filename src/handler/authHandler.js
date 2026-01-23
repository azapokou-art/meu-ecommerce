const RegisterUseCase = require('../application/use-cases/RegisterUseCase');
const LoginUseCase = require('../application/use-cases/LoginUseCase');
const ForgotPasswordUseCase = require('../application/use-cases/ForgotPasswordUseCase');
const ResetPasswordUseCase = require('../application/use-cases/ResetPasswordUseCase');
const DeleteAccountUseCase = require('../application/use-cases/DeleteAccountUseCase');
const UserRepositoryImpl = require('../infrastructure/database/repositories/UserRepositoryImpl');
const PasswordResetTokenRepositoryImpl = require('../infrastructure/database/repositories/PasswordResetTokenRepositoryImpl');   
const TokenGenerator = require('../infrastructure/services/TokenGenerator');
const EmailService = require('../infrastructure/services/EmailService');
const PasswordHasher = require('../infrastructure/services/PasswordHasher');
const TokenService = require('../infrastructure/services/TokenService');

const authHandler = {
    async register(req, res) {
        try {
            const UserRepository = new UserRepositoryImpl();
            const passwordHasher = new PasswordHasher();
            const registerUseCase = new RegisterUseCase(UserRepository, passwordHasher);

            const result = await registerUseCase.execute({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                cpf: req.body.cpf,
                phone: req.body.phone
            });
            res.status(201).json(result);
        } catch (error) {
            console.error('Registration error:', error);
            if (error.message.includes('Email already in use')) {
                return res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    },

           

           
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const userRepository = new UserRepositoryImpl();
            const passwordHasher = new PasswordHasher();
            const tokenService = new TokenService(process.env.JWT_SECRET);
            const loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenService);
            
            const result = await loginUseCase.execute({
                email: req.body.email,
                password: req.body.password
            });

            res.json(result);
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.message.includes('Invalid email or password')) {
                return res.status(401).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    },
            
    async logout(req, res) {
        try {
            
            res.json({ 
                message: 'Logout successful' 
            });

        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },


   async forgotPassword(req, res) {
        try {
            const userRepository = new UserRepositoryImpl();
            const tokenRepository = new PasswordResetTokenRepositoryImpl();
            const tokenGenerator = new TokenGenerator();
            const emailService = new EmailService();

            const forgotPasswordUseCase = new ForgotPasswordUseCase(
                userRepository,
                tokenRepository,
                tokenGenerator,
                emailService
            );
            const result = await forgotPasswordUseCase.execute(req.body.email);
            res.json(result);
        } catch (error) {
            console.error('Forgot password error:', error);
            
            if (error.message.includes('Invalid email address')) {
                return res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    },

    async resetPassword(req, res) {
        try {
            const tokenRepository = new PasswordResetTokenRepositoryImpl();
            const userRepository = new UserRepositoryImpl();
            const passwordHasher = new PasswordHasher();
            const passwordValidator = new PasswordValidator();

            const resetPasswordUseCase = new ResetPasswordUseCase(
                tokenRepository,
                userRepository,
                passwordHasher,
                passwordValidator
            );

            const result = await resetPasswordUseCase.execute(req.body.token, req.body.newPassword);
            res.json(result);
        } catch (error) {
            console.error('Reset password error:', error);

            if (
                error.message.includes('require') ||
                error.message.includes('must be') ||
                error.message.includes('Invalid') ||
                error.message.includes('expired') ||
                error.message.includes('already used')
            ) {
                return res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    },

    async deleteAccount(req, res) {
        try {
            const userId = req.user.userId;
            const userEmail = req.user.email;

            const userRepository = new UserRepositoryImpl();
            const passwordHasher = new PasswordHasher();
            const deleteAccountUseCase = new DeleteAccountUseCase(userRepository, passwordHasher);
            const result = await deleteAccountUseCase.execute(userId, userEmail, req.body.password);

            res.json(result);
        } catch (error) {
            console.error('Delete account error:', error);

            if (
                error.message.includes('required') ||
                error.message.includes('not found') ||
                error.message.includes('Invalid password') ||
                error.message.includes('mismatch')
            ) {
                const status = error.message.includes('Invalid password') ? 401 : 400;
                return res.status(status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    },

    async getProfile(req, res) {
        try {
            const userId = req.user.userId;
            
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({
                message: 'Profile retrieved successfully',
                user: user
            });

        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = authHandler;