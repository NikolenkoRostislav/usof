const pool = require('./db');
const CategoriesRepo = require('./repos/categories');
const CommentsRepo = require('./repos/comments');
const LikesRepo = require('./repos/likes');
const PostsRepo = require('./repos/posts');
const UsersRepo = require('./repos/users');
const RegistrationIntentsRepo = require('./repos/registration_intents');
const PasswordUpdateIntentsRepo = require('./repos/password_update_intents');
const AwardsRepo = require('./repos/awards');
const PostAwardsRepo = require('./repos/post_awards');
const OwnedAwardsRepo = require('./repos/owned_awards');

class UoW {
    constructor(connection) {
        this.connection = connection;
    }

    static async create() {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        return new UoW(connection);
    }

    static async createReadonly() {
        return new UoW(pool);
    }

    async commit() {
        await this.connection.commit();
    }

    async rollback() {
        await this.connection.rollback();
    }

    release() {
        this.connection.release();
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

    passwordUpdateIntents() {
        return new PasswordUpdateIntentsRepo(this.connection);
    }

    awards() {
        return new AwardsRepo(this.connection);
    }

    postAwards() {
        return new PostAwardsRepo(this.connection);
    }

    ownedAwards() {
        return new OwnedAwardsRepo(this.connection);
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
        } finally {
            uow.release();
        }
    };
}

async function getReadOnlyUoW() {
    return await UoW.createReadonly();
}

module.exports = { UoW, transactional, getReadOnlyUoW };
