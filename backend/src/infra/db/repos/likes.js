const { AppError, Kind } = require("../../../domain/errors");
const Like = require("../../../domain/entities/like");

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

    async findAllForPosts() {
        const [rows] = await this.connection.query("SELECT * FROM likes WHERE post_id is NOT NULL");

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

    async findAllForComments() {
        const [rows] = await this.connection.query("SELECT * FROM likes WHERE comment_id is NOT NULL");

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

    async findByAuthorAndPost(authorId, postId) {
        const [rows] = await this.connection.query(
            "SELECT * FROM likes WHERE author_id = ? AND post_id = ?",
            [authorId, postId]
        );

        if (!rows || rows.length === 0) return null;
        return this._fromRows(rows);
    }

    async findByAuthorAndComment(authorId, commentId) {
        const [rows] = await this.connection.query(
            "SELECT * FROM likes WHERE author_id = ? AND comment_id = ?",
            [authorId, commentId]
        );

        if (!rows || rows.length === 0) return null;
        return this._fromRows(rows);
    }

    async calculateUserReputation(userId) {
        const [rows] = await this.connection.query(
            `SELECT COALESCE(SUM(CASE
                WHEN all_likes.type = 'like' THEN 1
                WHEN all_likes.type = 'dislike' THEN -1
                ELSE 0
            END), 0) as reputation
            FROM (
                SELECT l.type FROM likes l
                JOIN posts p ON l.post_id = p.id
                WHERE p.author_id = ?
                UNION ALL
                SELECT l.type FROM likes l
                JOIN comments c ON l.comment_id = c.id
                WHERE c.author_id = ?
            ) as all_likes`,
            [userId, userId]
        );

        return rows[0].reputation;
    }
}

module.exports = LikesRepo