const { pool } = require('../config/database');

class SupportTicket {

    static async create(ticketData) {
        const { user_id, subject, description, priority } = ticketData;
        
        const sql = `
            INSERT INTO support_tickets (user_id, subject, description, priority) 
            VALUES (?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(sql, [user_id, subject, description, priority]);
        return result.insertId;
    }


    static async findByUserId(userId) {
        const sql = `
            SELECT * FROM support_tickets 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        `;
        const [rows] = await pool.execute(sql, [userId]);
        return rows;
    }

  
    static async findAll(filters = {}) {
        let sql = `
            SELECT st.*, u.name as user_name, u.email as user_email
            FROM support_tickets st
            JOIN users u ON st.user_id = u.id
        `;
        const params = [];

        if (filters.status) {
            sql += ' WHERE st.status = ?';
            params.push(filters.status);
        }

        sql += ' ORDER BY st.created_at DESC';

        if (filters.limit) {
            sql += ` LIMIT ${parseInt(filters.limit)}`;
        }

        const [rows] = await pool.execute(sql, params);
        return rows;
    }


    static async findById(id) {
        const sql = `
            SELECT st.*, u.name as user_name, u.email as user_email
            FROM support_tickets st
            JOIN users u ON st.user_id = u.id
            WHERE st.id = ?
        `;
        const [rows] = await pool.execute(sql, [id]);
        return rows[0];
    }

    
    static async update(id, updateData) {
        const { status, admin_notes } = updateData;
        
        const sql = 'UPDATE support_tickets SET status = ?, admin_notes = ? WHERE id = ?';
        const [result] = await pool.execute(sql, [status, admin_notes, id]);
        return result.affectedRows > 0;
    }
}

module.exports = SupportTicket;