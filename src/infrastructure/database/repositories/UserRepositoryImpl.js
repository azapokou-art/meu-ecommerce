const UserRepository = require('../../../domain/repositories/UserRepository');
const { pool } = require('../../database');

class UserRepositoryImpl extends UserRepository {

    async create(userData) {
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
    

    async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await pool.execute(sql, [email]);
        return rows[0];
    }

    async findById(id) {
        const sql = 'SELECT id, name, email, cpf, phone, profile_picture, role, created_at FROM users WHERE id = ?';
        const [rows] = await pool.execute(sql, [id]);
        return rows[0];
    }

    async findById(cpf) {
        const sql = 'SELECT id FROM users WHERE cpf = ?';
        const [rows] = await pool.execute(sql, [cpf]);
        return rows[0];
    }

    async deactivate(userId) {
        const sql = 'UPDATE users SET active = FALSE WHERE id = ?';
        await pool.execute(sql, [userId]);
    }
    async delete(userId) {
        const sql = 'DELETE FROM users WHERE id = ?';
        await pool.execute(sql, [userId]);
    }
    async findById(id) {
        const sql = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await pool.execute(sql, [id]);
        return rows[0] || null;
    }
    async findProfileById(id) {
        const sql = 'SELECT id, name, email, phone, created_at FROM users WHERE id = ?';
        const [rows] = await pool.execute(sql, [id]);
        return rows[0] || null;
    }
}
module.exports = UserRepositoryImpl;

    

    


