const { AppError, Kind } = require("../../../domain/errors");
const Category = require("../../../domain/entities/category");

class CategoriesRepo {
    constructor(connection) {
        this.connection = connection;
    }

    _fromRows(rows) {
        if (!rows || rows.length === 0) return null;

        return new Category({
            id: rows[0].id,
            title: rows[0].title,
            description: rows[0].description
        });
    }

    async findById(id) {
        const [rows] = await this.connection.query(
            "SELECT * FROM categories WHERE id = ?",
            [id]
        );

        return this._fromRows(rows);
    }

    async save(category) {
        try {
            const [result] = await this.connection.query(
                `UPDATE categories
                SET title = ?, description = ?
                WHERE id = ?`,
                [category.title, category.description, category.id]
            );
            if (result.affectedRows > 0)
                return;

            await this.connection.query(
                `INSERT INTO categories (id, title, description)
                VALUES (?, ?, ?)`,
                [category.id, category.title, category.description]
            );
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                throw new AppError(
                    Kind.Conflict,
                    "Category with this title already exists"
                );
            }

            throw error;
        }
    }

    async delete(id) {
        await this.connection.query(
            "DELETE FROM categories WHERE id = ?",
            [id]
        );
    }
}

module.exports = CategoriesRepo