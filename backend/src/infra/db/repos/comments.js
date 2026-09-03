const { AppError, Kind } = require("../../../domain/errors");
const Comment = require("../../../domain/entities/comment");

class CommentsRepo {
    constructor(connection) {
        this.connection = connection;
    }

    _fromRows(rows) {
        if (!rows || rows.length === 0) return null;

        return new Comment({
            id: rows[0].id,
            authorId: rows[0].author_id,
            postId: rows[0].post_id,
            publishDate: rows[0].publish_date,
            content: rows[0].content
        });
    }

    async findById(id) {
        const [rows] = await this.connection.query(
            "SELECT * FROM comments WHERE id = ?",
            [id]
        );

        return this._fromRows(rows);
    }

    async findByPostId(postId) {
        const [rows] = await this.connection.query(
            "SELECT * FROM comments WHERE post_id = ?",
            [postId]
        );

        if (!rows || rows.length === 0) return [];

        return rows.map(row => new Comment({
            id: row.id,
            authorId: row.author_id,
            postId: row.post_id,
            publishDate: row.publish_date,
            content: row.content
        }));
    }

    async findByAuthorId(authorId) {
        const [rows] = await this.connection.query(
            "SELECT * FROM comments WHERE author_id = ?",
            [authorId]
        );

        if (!rows || rows.length === 0) return [];

        return rows.map(row => new Comment({
            id: row.id,
            authorId: row.author_id,
            postId: row.post_id,
            publishDate: row.publish_date,
            content: row.content
        }));
    }

    async save(comment) {
        try {
            const [result] = await this.connection.query(
                `UPDATE comments
                SET author_id = ?, post_id = ?, publish_date = ?, content = ?
                WHERE id = ?`,
                [comment.authorId, comment.postId, comment.publishDate, comment.content, comment.id]
            );
            if (result.affectedRows > 0)
                return;

            await this.connection.query(
                `INSERT INTO comments (id, author_id, post_id, publish_date, content)
                VALUES (?, ?, ?, ?, ?)`,
                [comment.id, comment.authorId, comment.postId, comment.publishDate, comment.content]
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