const { AppError, Kind } = require("../../../domain/errors");
const Favorite = require("../../../domain/entities/favorite");

class FavoritesRepo {
    constructor(connection) {
        this.connection = connection;
    }

    async findByUserAndPost(userId, postId) {
        const [rows] = await this.connection.query(
            "SELECT * FROM favorites WHERE user_id = ? AND post_id = ?",
            [userId, postId]
        );

        if (!rows || rows.length === 0) return null;

        return new Favorite({
            userId: rows[0].user_id,
            postId: rows[0].post_id
        });
    }

    async findByUserId(userId) {
        const [rows] = await this.connection.query(
            "SELECT * FROM favorites WHERE user_id = ?",
            [userId]
        );

        if (!rows || rows.length === 0) return [];

        return rows.map(row => new Favorite({
            userId: row.user_id,
            postId: row.post_id
        }));
    }

    async save(favorite) {
        try {
            await this.connection.query(
                "INSERT INTO favorites (user_id, post_id) VALUES (?, ?)",
                [favorite.userId, favorite.postId]
            );
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                throw new AppError(
                    Kind.Conflict,
                    "This post is already in your favorites"
                );
            }

            throw error;
        }
    }

    async delete(userId, postId) {
        await this.connection.query(
            "DELETE FROM favorites WHERE user_id = ? AND post_id = ?",
            [userId, postId]
        );
    }
}

module.exports = FavoritesRepo;
