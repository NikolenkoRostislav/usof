const Award = require("../../../domain/entities/award");

class AwardsRepo {
    constructor(connection) {
        this.connection = connection;
    }

    _fromRows(rows) {
        if (!rows || rows.length === 0) return null;

        return new Award({
            id: rows[0].id,
            title: rows[0].title,
            description: rows[0].description,
            rarity: rows[0].rarity
        });
    }

    async findById(id) {
        const [rows] = await this.connection.query(
            "SELECT * FROM awards WHERE id = ?",
            [id]
        );

        return this._fromRows(rows);
    }

    async findAll() {
        const [rows] = await this.connection.query("SELECT * FROM awards");

        if (!rows || rows.length === 0) return [];

        return rows.map(row => new Award({
            id: row.id,
            title: row.title,
            description: row.description,
            rarity: row.rarity
        }));
    }
}

module.exports = AwardsRepo;
