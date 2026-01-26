class DeleteAccountUseCase {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }
  
  async execute(userId, email, password) {

    if (!password) {
      throw new Error('Password is required for account deletion');
    }
    
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    
    const validPassword = await this.passwordHasher.compare(
      password, 
      user.password
    );
    if (!validPassword) {
      throw new Error('Invalid password');
    }
    
    if (user.id !== userId) {
      throw new Error('User mismatch');
    }
    

    await this.userRepository.deactivate(userId);
    
    return { message: 'Account deleted successfully' };
  }
}

module.exports = DeleteAccountUseCase;