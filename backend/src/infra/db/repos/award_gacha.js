class AwardGachaRepo {
    constructor(connection) {
        this.connection = connection;
    }

    async findByUserId(userId) {
        const [rows] = await this.connection.query(
            "SELECT * FROM award_gacha WHERE user_id = ?",
            [userId]
        );

        if (!rows || rows.length === 0) return null;

        return {
            userId: rows[0].user_id,
            lastRolled: rows[0].last_rolled,
            totalRolls: rows[0].total_rolls
        };
    }

    async save(userId, lastRolled, totalRolls) {
        const existing = await this.findByUserId(userId);

        if (existing) {
            await this.connection.query(
                "UPDATE award_gacha SET last_rolled = ?, total_rolls = ? WHERE user_id = ?",
                [lastRolled, totalRolls, userId]
            );
        } else {
            await this.connection.query(
                "INSERT INTO award_gacha (user_id, last_rolled, total_rolls) VALUES (?, ?, ?)",
                [userId, lastRolled, totalRolls]
            );
        }
    }
}

module.exports = AwardGachaRepo;
