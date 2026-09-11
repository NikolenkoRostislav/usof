class OwnedAwardsRepo {
    constructor(connection) {
        this.connection = connection;
    }

    async findByUserIdAndAwardId(userId, awardId) {
        const [rows] = await this.connection.query(
            "SELECT * FROM owned_awards WHERE user_id = ? AND award_id = ?",
            [userId, awardId]
        );

        if (!rows || rows.length === 0) return null;

        return {
            userId: rows[0].user_id,
            awardId: rows[0].award_id,
            count: rows[0].count
        };
    }

    async findByUserId(userId) {
        const [rows] = await this.connection.query(
            `SELECT oa.*, a.title, a.description, a.rarity
            FROM owned_awards oa
            JOIN awards a ON oa.award_id = a.id
            WHERE oa.user_id = ?`,
            [userId]
        );

        if (!rows || rows.length === 0) return [];

        return rows.map(row => ({
            userId: row.user_id,
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

    async save(userId, awardId, count) {
        const existing = await this.findByUserIdAndAwardId(userId, awardId);

        if (existing) {
            if (count <= 0) {
                await this.connection.query(
                    "DELETE FROM owned_awards WHERE user_id = ? AND award_id = ?",
                    [userId, awardId]
                );
            } else {
                await this.connection.query(
                    "UPDATE owned_awards SET count = ? WHERE user_id = ? AND award_id = ?",
                    [count, userId, awardId]
                );
            }
        } else {
            if (count > 0) {
                await this.connection.query(
                    "INSERT INTO owned_awards (user_id, award_id, count) VALUES (?, ?, ?)",
                    [userId, awardId, count]
                );
            }
        }
    }
}

module.exports = OwnedAwardsRepo;
