const { AppError, Kind } = require("../../../domain/errors");
const RegistrationIntent = require("../../../domain/entities/registration_intent");

class RegistrationIntentsRepo {
    constructor(connection) {
        this.connection = connection;
    }

    _fromRows(rows) {
        if (!rows || rows.length === 0) return null;

        return new RegistrationIntent({
            id: rows[0].id,
            tokenHash: rows[0].token_hash,
            login: rows[0].login,
            passwordHash: rows[0].password_hash,
            email: rows[0].email,
            fullName: rows[0].full_name,
            createdAt: rows[0].created_at
        });
    }

    async findById(id) {
        const [rows] = await this.connection.query(
            "SELECT * FROM registration_intents WHERE id = ?",
            [id]
        );

        return this._fromRows(rows);
    }

    async findByTokenHash(tokenHash) {
        const [rows] = await this.connection.query(
            "SELECT * FROM registration_intents WHERE token_hash = ?",
            [tokenHash]
        );

        return this._fromRows(rows);
    }

    async findByLogin(login) {
        const [rows] = await this.connection.query(
            "SELECT * FROM registration_intents WHERE login = ?",
            [login]
        );

        return this._fromRows(rows);
    }

    async findByEmail(email) {
        const [rows] = await this.connection.query(
            "SELECT * FROM registration_intents WHERE email = ?",
            [email]
        );

        return this._fromRows(rows);
    }

    async save(registrationIntent) {
        try {
            const [result] = await this.connection.query(
                `UPDATE registration_intents
                SET token_hash = ?, login = ?, password_hash = ?, email = ?, full_name = ?
                WHERE id = ?`,
                [registrationIntent.tokenHash, registrationIntent.login, registrationIntent.passwordHash, registrationIntent.email, registrationIntent.fullName, registrationIntent.id]
            );
            if (result.affectedRows > 0)
                return;

            await this.connection.query(
                `INSERT INTO registration_intents (id, token_hash, login, password_hash, email, full_name)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [registrationIntent.id, registrationIntent.tokenHash, registrationIntent.login, registrationIntent.passwordHash, registrationIntent.email, registrationIntent.fullName]
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
            "DELETE FROM registration_intents WHERE id = ?",
            [id]
        );
    }

    async deleteByEmailOrLogin(email, login) {
        await this.connection.query(
            "DELETE FROM registration_intents WHERE email = ? OR login = ?",
            [email, login]
        );
    }

    async deleteByTokenHash(tokenHash) {
        await this.connection.query(
            "DELETE FROM registration_intents WHERE token_hash = ?",
            [tokenHash]
        );
    }
}

module.exports = RegistrationIntentsRepo;
