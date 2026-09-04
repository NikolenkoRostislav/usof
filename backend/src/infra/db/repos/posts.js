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

    async findAll(options = {}) {
        const { sortBy = 'likes', categories = [], fromDate, toDate, page = 0, limit = 20 } = options;

        let query = `
            SELECT p.*,
                    COALESCE(SUM(CASE WHEN l.type = 'like' THEN 1 ELSE 0 END), 0) as like_count
            FROM posts p
            LEFT JOIN likes l ON p.id = l.post_id
        `;

        const params = [];
        const conditions = ['p.status != \'inactive\''];

        if (categories.length > 0) {
            query += ` JOIN post_categories pc ON p.id = pc.post_id`;
            conditions.push(`pc.category_id IN (${categories.map(() => '?').join(',')})`);
            params.push(...categories);
        }

        if (fromDate) {
            conditions.push(`p.publish_date >= ?`);
            params.push(fromDate);
        }

        if (toDate) {
            conditions.push(`p.publish_date <= ?`);
            params.push(toDate);
        }

        query += ` WHERE ${conditions.join(' AND ')}`;
        query += ` GROUP BY p.id`;

        if (sortBy === 'likes') {
            query += ` ORDER BY like_count DESC, p.publish_date DESC`;
        } else if (sortBy === 'date') {
            query += ` ORDER BY p.publish_date DESC`;
        }

        const offset = page * limit;
        query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [rows] = await this.connection.query(query, params);

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

    async findByCategory(categoryId, options = {}) {
        const { sortBy = 'likes', page = 0, limit = 20 } = options;

        let query = `
            SELECT p.*,
                    COALESCE(SUM(CASE WHEN l.type = 'like' THEN 1 ELSE 0 END), 0) as like_count
            FROM posts p
            JOIN post_categories pc ON p.id = pc.post_id
            LEFT JOIN likes l ON p.id = l.post_id
            WHERE pc.category_id = ? AND NOT p.status = 'inactive'
            GROUP BY p.id
        `;

        if (sortBy === 'likes') {
            query += ` ORDER BY like_count DESC, p.publish_date DESC`;
        } else if (sortBy === 'date') {
            query += ` ORDER BY p.publish_date DESC`;
        }

        const offset = page * limit;
        query += ` LIMIT ? OFFSET ?`;

        const [rows] = await this.connection.query(query, [categoryId, limit, offset]);

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

    async getCategories(postId) {
        const [rows] = await this.connection.query(
            `SELECT c.* FROM categories c
            JOIN post_categories pc ON c.id = pc.category_id
            WHERE pc.post_id = ?`,
            [postId]
        );

        if (!rows || rows.length === 0) return [];

        return rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description
        }));
    }

    async addCategories(postId, categoryIds) {
        for (const categoryId of categoryIds) {
            await this.connection.query(
                `INSERT INTO post_categories (post_id, category_id)
                VALUES (?, ?)`,
                [postId, categoryId]
            );
        }
    }

    async updateCategories(postId, categoryIds) {
        await this.connection.query(
            "DELETE FROM post_categories WHERE post_id = ?",
            [postId]
        );

        if (categoryIds && categoryIds.length > 0) {
            await this.addCategories(postId, categoryIds);
        }
    }
}

module.exports = PostsRepo