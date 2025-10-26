const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    }
};

module.exports = authController;