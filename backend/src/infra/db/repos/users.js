const { AppError, Kind } = require("../../../domain/errors");
const User = require("../../../domain/entities/user");

class UsersRepo {
    constructor(connection) {
        this.connection = connection;
    }

    _fromRows(rows) {
        if (!rows || rows.length === 0) return null;

        return new User({
            id: rows[0].id,
            login: rows[0].login,
            passwordHash: rows[0].password_hash,
            fullName: rows[0].full_name,
            email: rows[0].email,
            pfpKey: rows[0].pfp_key,
            role: rows[0].role
        });
    }

    async findById(id) {
        const [rows] = await this.connection.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );

        return this._fromRows(rows);
    }

    async findByLogin(login) {
        const [rows] = await this.connection.query(
            "SELECT * FROM users WHERE login = ?",
            [login]
        );

        return this._fromRows(rows);
    }

    async findByEmail(email) {
        const [rows] = await this.connection.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        return this._fromRows(rows);
    }

    async save(user) {
        try {
            const [result] = await this.connection.query(
                `UPDATE users
                SET login = ?, full_name = ?, password_hash = ?, email = ?, pfp_key = ?, role = ?
                WHERE id = ?`,
                [user.login, user.fullName, user.passwordHash, user.email, user.pfpKey, user.role, user.id]
            );
            if (result.affectedRows > 0)
                return;

            await this.connection.query(
                `INSERT INTO users (id, login, full_name, password_hash, email, pfp_key, role)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [user.id, user.login, user.fullName, user.passwordHash, user.email, user.pfpKey, user.role]
            );
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                throw new AppError(
                    Kind.Conflict,
                    "User with this login or email already exists"
                );
            }

            throw error;
        }
    }

    async delete(id) {
        await this.connection.query(
            "DELETE FROM users WHERE id = ?",
            [id]
        );
    }
}

module.exports = UsersRepo