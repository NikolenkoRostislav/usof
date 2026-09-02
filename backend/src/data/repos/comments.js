Comment = require("../../entities/comment.js");

class CommentsRepo {
    constructor(connection) {
        this.connection = connection;
    }

    _fromRows(rows) {
        if (!rows || rows.length === 0) return null;

        return
    }

    async findById(id) {
        const [rows] = await this.connection.query(
            "SELECT * FROM comments WHERE id = ?",
            [id]
        );

        return this._fromRows(rows);
    }

    async save(comment) {
        try {
            const [result] = await this.connection.query(
                `UPDATE comments
                SET 
                WHERE id = ?`,
                [, comment.id]
            );
            if (result.affectedRows > 0)
                return;

            await this.connection.query(
                `INSERT INTO comments (id,)
                VALUES (?,)`,
                [comment.id,]
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
            "DELETE FROM comments WHERE id = ?",
            [id]
        );
    }
}

module.exports = CommentsRepo