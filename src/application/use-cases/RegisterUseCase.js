const User = require('../../domain/entities/User');
const { create } = require('../../models/Order');

class RegisterUseCase {
    constructor(userRepository, passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    async execute(input) {
        const existingUser = await this.userRepository.findByEmail(input.email);
        if (existingUser) {
            throw new Error('Email already in use');
        }

        if (input.cpf) {
            const existingCPF = await this.userRepository.findBy(input.cpf);
            if (existingCPF) {
                throw new Error('CPF already in use');
            }
        }
        const hashedPassword = await this.passwordHasher.hash(input.password);
        const user = new User(
            null,
            input.name,
            input.email,
            hashedPassword,
            input.cpf,
            input.phone
        );
        const createdUser = await this.userRepository.create(user);
        return {
            message: 'User registered successfully',
            userId: createdUser.id
        };
    }
        }

module.exports = RegisterUseCase;


