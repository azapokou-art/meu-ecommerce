const { pool } = require('../config/database');

class User {

    static async create(userData) {
        const { name, email, password, cpf, phone } = userData;
        
        const sql = `
            INSERT INTO users (name, email, password, cpf, phone) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const cpfValue = cpf || null;
        const phoneValue = phone || null;
        
        const [result] = await pool.execute(sql, [name, email, password, cpfValue, phoneValue]);
        return result.insertId;
    }

    static async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await pool.execute(sql, [email]);
        return rows[0];
    }

    static async findById(id) {
    const sql = 'SELECT id, name, email, cpf, phone, profile_picture, role, created_at FROM users WHERE id = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
}

    static async findByCPF(cpf) {
        const sql = 'SELECT id FROM users WHERE cpf = ?';
        const [rows] = await pool.execute(sql, [cpf]);
        return rows[0];
    
}


static async updateProfile(userId, updateData) {
    const { name, email, phone, cpf, profile_picture } = updateData;
    
    const sql = `
        UPDATE users 
        SET name = ?, email = ?, phone = ?, cpf = ?, profile_picture = ?, updated_at = NOW()
        WHERE id = ?
    `;
    
    const params = [
        name || null,
        email || null, 
        phone || null,
        cpf || null,
        profile_picture || null,
        userId
    ];
    
    const [result] = await pool.execute(sql, params);
    return result.affectedRows > 0;
}


static async updateProfilePicture(userId, profilePicture) {
    const sql = 'UPDATE users SET profile_picture = ?, updated_at = NOW() WHERE id = ?';
    const [result] = await pool.execute(sql, [profilePicture, userId]);
    return result.affectedRows > 0;
}

static async isEmailTaken(email, excludeUserId = null) {
    let sql = 'SELECT id FROM users WHERE email = ?';
    let params = [email];
    
    if (excludeUserId) {
        sql += ' AND id != ?';
        params.push(excludeUserId);
    }
    
    const [rows] = await pool.execute(sql, params);
    return rows.length > 0;
}
}

module.exports = User;