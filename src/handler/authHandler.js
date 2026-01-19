const RegisterUseCase = require('../application/use-cases/RegisterUseCase');
const LoginUseCase = require('../application/use-cases/LoginUseCase');
const ForgotPasswordUseCase = require('../application/use-cases/ForgotPasswordUseCase');
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
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
                return res.status(400).json({ error: 'Token and new password are required' });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters' });
            }

       
            const sql = `
                SELECT prt.*, u.email 
                FROM password_reset_tokens prt
                JOIN users u ON prt.user_id = u.id
                WHERE prt.token = ? AND prt.used = FALSE AND prt.expires_at > NOW()
            `;
            const [tokens] = await pool.execute(sql, [token]);

            if (tokens.length === 0) {
                return res.status(400).json({ error: 'Invalid or expired token' });
            }

            const resetToken = tokens[0];

           
            const hashedPassword = await bcrypt.hash(newPassword, 10);

          
            const updateSql = 'UPDATE users SET password = ? WHERE id = ?';
            await pool.execute(updateSql, [hashedPassword, resetToken.user_id]);

          
            const markUsedSql = 'UPDATE password_reset_tokens SET used = TRUE WHERE id = ?';
            await pool.execute(markUsedSql, [resetToken.id]);

            res.json({ 
                message: 'Password reset successfully' 
            });

        } catch (error) {
            console.error('Reset password error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },



    async deleteAccount(req, res) {
        try {
            const userId = req.user.userId;
            const { password } = req.body;

            if (!password) {
                return res.status(400).json({ error: 'Password is required for account deletion' });
            }

            
            const user = await User.findByEmail(req.user.email);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid password' });
            }

        
            const sql = 'UPDATE users SET active = FALSE WHERE id = ?';
            await pool.execute(sql, [userId]);

            res.json({ 
                message: 'Account deleted successfully' 
            });

        } catch (error) {
            console.error('Delete account error:', error);
            res.status(500).json({ error: 'Internal server error' });
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