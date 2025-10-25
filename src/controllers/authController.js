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
    }
};

module.exports = authController;