const { AppError, Kind } = require("../../../domain/errors");
const Post = require("../../../domain/entities/post");

class PostsRepo {
    constructor(connection) {
        this.connection = connection;
    }

    _fromRows(rows) {
        if (!rows || rows.length === 0) return null;

        return new Post({
            id: rows[0].id,
            authorId: rows[0].author_id,
            title: rows[0].title,
            publishDate: rows[0].publish_date,
            status: rows[0].status,
            content: rows[0].content
        });
    }

    async findById(id) {
        const [rows] = await this.connection.query(
            "SELECT * FROM posts WHERE id = ?",
            [id]
        );

        return this._fromRows(rows);
    }

    async findByAuthorId(authorId) {
        const [rows] = await this.connection.query(
            "SELECT * FROM posts WHERE author_id = ?",
            [authorId]
        );

        if (!rows || rows.length === 0) return [];

        return rows.map(row => new Post({
            id: row.id,
            authorId: row.author_id,
            title: row.title,
            publishDate: row.publish_date,
            status: row.status,
            content: row.content
        }));
    }

    async save(post) {
        try {
            const [result] = await this.connection.query(
                `UPDATE posts
                SET author_id = ?, title = ?, publish_date = ?, status = ?, content = ?
                WHERE id = ?`,
                [post.authorId, post.title, post.publishDate, post.status, post.content, post.id]
            );
            if (result.affectedRows > 0)
                return;

            await this.connection.query(
                `INSERT INTO posts (id, author_id, title, publish_date, status, content)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [post.id, post.authorId, post.title, post.publishDate, post.status, post.content]
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