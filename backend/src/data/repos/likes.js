Like = require("../../entities/like.js");

class LikesRepo {
    constructor(connection) {
        this.connection = connection;
    }

    _fromRows(rows) {
        if (!rows || rows.length === 0) return null;

        return
    }

    async findById(id) {
        const [rows] = await this.connection.query(
            "SELECT * FROM likes WHERE id = ?",
            [id]
        );

        return this._fromRows(rows);
    }

    async save(like) {
        try {
            const [result] = await this.connection.query(
                `UPDATE likes
                SET 
                WHERE id = ?`,
                [, like.id]
            );
            if (result.affectedRows > 0)
                return;

            await this.connection.query(
                `INSERT INTO likes (id,)
                VALUES (?,)`,
                [like.id,]
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
            "DELETE FROM likes WHERE id = ?",
            [id]
        );
    }
}

module.exports = LikesRepo