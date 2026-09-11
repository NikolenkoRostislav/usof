class PostAwardsRepo {
    constructor(connection) {
        this.connection = connection;
    }

    async findByPostId(postId) {
        const [rows] = await this.connection.query(
            `SELECT pa.*, a.title, a.description, a.rarity
            FROM post_awards pa
            JOIN awards a ON pa.award_id = a.id
            WHERE pa.post_id = ?`,
            [postId]
        );

        if (!rows || rows.length === 0) return [];

        return rows.map(row => ({
            postId: row.post_id,
            awardId: row.award_id,
            count: row.count,
            award: {
                id: row.award_id,
                title: row.title,
                description: row.description,
                rarity: row.rarity
            }
        }));
    }

    async findByPostIdAndAwardId(postId, awardId) {
        const [rows] = await this.connection.query(
            "SELECT * FROM post_awards WHERE post_id = ? AND award_id = ?",
            [postId, awardId]
        );

        if (!rows || rows.length === 0) return null;

        return {
            postId: rows[0].post_id,
            awardId: rows[0].award_id,
            count: rows[0].count
        };
    }

    async save(postId, awardId, count) {
        const existing = await this.findByPostIdAndAwardId(postId, awardId);

        if (existing) {
            await this.connection.query(
                "UPDATE post_awards SET count = ? WHERE post_id = ? AND award_id = ?",
                [count, postId, awardId]
            );
        } else {
            await this.connection.query(
                "INSERT INTO post_awards (post_id, award_id, count) VALUES (?, ?, ?)",
                [postId, awardId, count]
            );
        }
    }

    async delete(postId, awardId) {
        await this.connection.query(
            "DELETE FROM post_awards WHERE post_id = ? AND award_id = ?",
            [postId, awardId]
        );
    }
}

module.exports = PostAwardsRepo;
