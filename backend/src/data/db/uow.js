const pool = require('./db.js');
const CategoriesRepo = require('./repos/categories.js');
const CommentsRepo = require('./repos/comments.js');
const LikesRepo = require('./repos/likes.js');
const PostsRepo = require('./repos/posts.js');
const UsersRepo = require('./repos/users.js');
const RegistrationIntentsRepo = require('./repos/registration_intents.js');

class UoW {
    constructor(connection) {
        this.connection = connection;
    }

    static async create() {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        return new UoW(connection);
    }

    async commit() {
        await this.connection.commit();
    }

    async rollback() {
        await this.connection.rollback();
    }

    categories() {
        return new CategoriesRepo(this.connection);
    }

    comments() {
        return new CommentsRepo(this.connection);
    }

    likes() {
        return new LikesRepo(this.connection);
    }

    posts() {
        return new PostsRepo(this.connection);
    }

    users() {
        return new UsersRepo(this.connection);
    }

    registrationIntents() {
        return new RegistrationIntentsRepo(this.connection);
    }
}

function transactional(fn) {
    return async function (...args) {
        const uow = await UoW.create();
        try {
            const result = await fn(uow, ...args);
            await uow.commit();
            return result;
        } catch (error) {
            await uow.rollback();
            throw error;
        }
    };
}

module.exports = { UoW, transactional };
