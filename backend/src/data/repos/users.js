User = require("../../entities/user.js");

class UsersRepo {
    constructor(connection) {
        this.connection = connection;
    }

    _fromRows(rows) {
        if (!rows || rows.length === 0) return null;

        return
    }

    async findById(id) {
        const [rows] = await this.connection.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );

        return this._fromRows(rows);
    }

    async save(user) {
        try {
            const [result] = await this.connection.query(
                `UPDATE users
                SET 
                WHERE id = ?`,
                [, user.id]
            );
            if (result.affectedRows > 0)
                return;

            await this.connection.query(
                `INSERT INTO users (id,)
                VALUES (?,)`,
                [user.id,]
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
            "DELETE FROM users WHERE id = ?",
            [id]
        );
    }
}

module.exports = UsersRepo