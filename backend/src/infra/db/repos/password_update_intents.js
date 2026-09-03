const { AppError, Kind } = require("../../../domain/errors");
const PasswordUpdateIntent = require("../../../domain/entities/password_update_intent");

class PasswordUpdateIntentsRepo {
    constructor(connection) {
        this.connection = connection;
    }

    _fromRows(rows) {
        if (!rows || rows.length === 0) return null;

        return new PasswordUpdateIntent({
            id: rows[0].id,
            tokenHash: rows[0].token_hash,
            email: rows[0].email,
            passwordHash: rows[0].password_hash,
            isUsed: rows[0].is_used,
            createdAt: rows[0].created_at
        });
    }

    async findById(id) {
        const [rows] = await this.connection.query(
            "SELECT * FROM password_update_intents WHERE id = ?",
            [id]
        );

        return this._fromRows(rows);
    }

    async findByTokenHash(tokenHash) {
        const [rows] = await this.connection.query(
            "SELECT * FROM password_update_intents WHERE token_hash = ?",
            [tokenHash]
        );

        return this._fromRows(rows);
    }

    async findByEmail(email) {
        const [rows] = await this.connection.query(
            "SELECT * FROM password_update_intents WHERE email = ?",
            [email]
        );

        return this._fromRows(rows);
    }

    async save(passwordUpdateIntent) {
        try {
            const [result] = await this.connection.query(
                `UPDATE password_update_intents
                SET token_hash = ?, email = ?, password_hash = ?, is_used = ?
                WHERE id = ?`,
                [passwordUpdateIntent.tokenHash, passwordUpdateIntent.email, passwordUpdateIntent.passwordHash, passwordUpdateIntent.isUsed, passwordUpdateIntent.id]
            );
            if (result.affectedRows > 0)
                return;

            await this.connection.query(
                `INSERT INTO password_update_intents (id, token_hash, email, password_hash, is_used)
                VALUES (?, ?, ?, ?, ?)`,
                [passwordUpdateIntent.id, passwordUpdateIntent.tokenHash, passwordUpdateIntent.email, passwordUpdateIntent.passwordHash, passwordUpdateIntent.isUsed]
            );
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                throw new AppError(
                    Kind.Conflict,
                    "Conflict Error"
                );
            }

            throw error;
        }
    }

    async delete(id) {
        await this.connection.query(
            "DELETE FROM password_update_intents WHERE id = ?",
            [id]
        );
    }

    async deleteByTokenHash(tokenHash) {
        await this.connection.query(
            "DELETE FROM password_update_intents WHERE token_hash = ?",
            [tokenHash]
        );
    }
}

module.exports = PasswordUpdateIntentsRepo;
