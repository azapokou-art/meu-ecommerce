class User {
    constructor(id, name, email, password, cpf, phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.cpf = cpf;
        this.phone = phone;

        this.validate();
    }
    validate() {
        if (!this.name || typeof this.name !== 'string') {
            throw new Error('Invalid name');
        }
        if (!this.email || typeof this.email !== 'string' || !this.email.includes('@')) {
            throw new Error('Invalid email');
        }
        if (!this.password || typeof this.password !== 'string' || this.password.length < 6) {
            throw new Error('Invalid password');
        }
        if (this.cpf && (typeof this.cpf !== 'string' || this.cpf.length !== 11)) {
            throw new Error('Invalid CPF');
        }
        if (this.phone && (typeof this.phone !== 'string' || this.phone.length < 10)) {
            throw new Error('Invalid phone number');
        }
    }

isValidCPF(cpf) {
    const cleanedCpf = cpf.replace(/\D/g, '');
    if (cleanedCpf.length !== 11 || /^(\d)\1+$/.test(cleanedCpf)) {
        return false;
    }
    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cleanedCpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    if (remainder !== parseInt(cleanedCpf.substring(9, 10))) {
        return false;
    }
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cleanedCpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    if (remainder !== parseInt(cleanedCpf.substring(10, 11))) {
        return false;
    }
    return true;
}

changePassword(newPassword) {
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
        throw new Error('Invalid password');
    }
    this.password = newPassword;
}  
}

module.exports = User;