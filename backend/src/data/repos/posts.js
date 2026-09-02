Post = require("../../entities/post.js");

class PostsRepo {
    constructor(connection) {
        this.connection = connection;
    }

    _fromRows(rows) {
        if (!rows || rows.length === 0) return null;

        return
    }

    async findById(id) {
        const [rows] = await this.connection.query(
            "SELECT * FROM posts WHERE id = ?",
            [id]
        );

        return this._fromRows(rows);
    }

    async save(post) {
        try {
            const [result] = await this.connection.query(
                `UPDATE posts
                SET 
                WHERE id = ?`,
                [, post.id]
            );
            if (result.affectedRows > 0)
                return;

            await this.connection.query(
                `INSERT INTO posts (id,)
                VALUES (?,)`,
                [post.id,]
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
            "DELETE FROM posts WHERE id = ?",
            [id]
        );
    }
}

module.exports = PostsRepo