const { AppError, Kind } = require("../../../domain/errors.js");
const Like = require("../../../domain/entities/like.js");

class LikesRepo {
    constructor(connection) {
        this.connection = connection;
    }

    _fromRows(rows) {
        if (!rows || rows.length === 0) return null;

        return new Like({
            id: rows[0].id,
            authorId: rows[0].author_id,
            publishDate: rows[0].publish_date,
            type: rows[0].type,
            postId: rows[0].post_id,
            commentId: rows[0].comment_id
        });
    }

    async findById(id) {
        const [rows] = await this.connection.query(
            "SELECT * FROM likes WHERE id = ?",
            [id]
        );

        return this._fromRows(rows);
    }

    async findByPostId(postId) {
        const [rows] = await this.connection.query(
            "SELECT * FROM likes WHERE post_id = ?",
            [postId]
        );

        if (!rows || rows.length === 0) return [];

        return rows.map(row => new Like({
            id: row.id,
            authorId: row.author_id,
            publishDate: row.publish_date,
            type: row.type,
            postId: row.post_id,
            commentId: row.comment_id
        }));
    }

    async findByCommentId(commentId) {
        const [rows] = await this.connection.query(
            "SELECT * FROM likes WHERE comment_id = ?",
            [commentId]
        );

        if (!rows || rows.length === 0) return [];

        return rows.map(row => new Like({
            id: row.id,
            authorId: row.author_id,
            publishDate: row.publish_date,
            type: row.type,
            postId: row.post_id,
            commentId: row.comment_id
        }));
    }

    async save(like) {
        try {
            const [result] = await this.connection.query(
                `UPDATE likes
                SET author_id = ?, publish_date = ?, type = ?, post_id = ?, comment_id = ?
                WHERE id = ?`,
                [like.authorId, like.publishDate, like.type, like.postId, like.commentId, like.id]
            );
            if (result.affectedRows > 0)
                return;

            await this.connection.query(
                `INSERT INTO likes (id, author_id, publish_date, type, post_id, comment_id)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [like.id, like.authorId, like.publishDate, like.type, like.postId, like.commentId]
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