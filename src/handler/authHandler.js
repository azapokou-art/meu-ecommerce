const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../infrastructure/database');

const authController = {
    async register(req, res) {
        try {
            const { name, email, password, cpf, phone } = req.body;

            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            if (cpf) {
                const existingCPF = await User.findByCPF(cpf);
                if (existingCPF) {
                    return res.status(400).json({ error: 'CPF already registered' });
                }
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const userId = await User.create({
                name,
                email,
                password: hashedPassword,
                cpf,
                phone
            });

            res.status(201).json({ 
                message: 'User created successfully',
                userId: userId 
            });

        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            console.log('Body completo:', req.body);
        console.log('Email:', email);
        console.log('Password:', password);


            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign(
                { 
                    userId: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            const { password: _, ...userWithoutPassword } = user;
            
            res.json({
                message: 'Login successful',
                user: userWithoutPassword,
                token: token
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
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
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            const user = await User.findByEmail(email);
            if (!user) {
             

                return res.json({ 
                    message: 'If the email exists, a password reset link has been sent' 
                });
            }

        
            const crypto = require('crypto');
            const resetToken = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

        
            const sql = `
                INSERT INTO password_reset_tokens (user_id, token, expires_at) 
                VALUES (?, ?, ?)
            `;
            await pool.execute(sql, [user.id, resetToken, expiresAt]);


            res.json({ 
                message: 'Password reset token generated',
                resetToken: resetToken,
                expiresAt: expiresAt
            });

        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({ error: 'Internal server error' });
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

module.exports = authController;