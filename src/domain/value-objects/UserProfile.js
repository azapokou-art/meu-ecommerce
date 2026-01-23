class UserProfile {
    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.phone = user.phone;
        this.createdAt = user.createdAt;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            phone: this.phone,
            createdAt: this.createdAt,
        };
    }
}

module.exports = UserProfile;