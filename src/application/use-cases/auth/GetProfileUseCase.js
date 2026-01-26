class GetProfileUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(userId) {
       const user = await this.userRepository.findById(userId);
       if (!user) {
           throw new Error('User not found');
       }
       return {
        message: 'Profile retrieved successfully',
        user: safeUser
         };
    }
}

module.exports = GetProfileUseCase;