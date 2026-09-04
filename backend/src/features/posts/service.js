const Post = require("../../domain/entities/post");
const { transactional } = require("../../infra/db/uow");
const { AppError, Kind } = require("../../domain/errors");

async function getAll() {
    return await transactional(_getAll)();
}

async function _getAll(uow) {
    const postsRepo = uow.posts();
    return await postsRepo.findAll();
}

async function create(userId, title, content, categoryIds = []) {
    return await transactional(_create)(userId, title, content, categoryIds);
}

async function _create(uow, userId, title, content, categoryIds) {
    const post = new Post({
        authorId: userId,
        title,
        content
    });

    const postsRepo = uow.posts();
    await postsRepo.save(post);

    if (categoryIds && categoryIds.length > 0) {
        await postsRepo.addCategories(post.id, categoryIds);
        post.categories = categoryIds;
    }

    return post;
}

async function getById(postId) {
    return await transactional(_getById)(postId);
}

async function _getById(uow, postId) {
    const postsRepo = uow.posts();
    const post = await postsRepo.findById(postId);

    if (!post || post.status === "inactive") {
        throw new AppError(Kind.NotFound, "Post not found");
    }

    post.categories = await postsRepo.getCategories(postId);
    return post;
}

async function update(postId, userId, updates) {
    return await transactional(_update)(postId, userId, updates);
}

async function _update(uow, postId, userId, updates) {
    const postsRepo = uow.posts();
    const post = await postsRepo.findById(postId);

    if (!post) {
        throw new AppError(Kind.NotFound, "Post not found");
    }

    if (post.authorId !== userId) {
        throw new AppError(Kind.PermissionDenied, "You cannot modify this post");
    }

    if (updates.title !== undefined) {
        post.title = updates.title;
    }
    if (updates.content !== undefined) {
        post.content = updates.content;
    }

    await postsRepo.save(post);

    if (updates.categories !== undefined) {
        await postsRepo.updateCategories(postId, updates.categories);
        post.categories = updates.categories;
    }

    return post;
}

async function deletePost(postId, userId) {
    return await transactional(_deletePost)(postId, userId);
}

async function _deletePost(uow, postId, userId) {
    const postsRepo = uow.posts();
    const usersRepo = uow.users();
    const post = await postsRepo.findById(postId);
    const user = await usersRepo.findById(userId)

    if (!post) {
        throw new AppError(Kind.NotFound, "Post not found");
    }

    if (!user) {
        throw new AppError(Kind.PermissionDenied, "You cannot delete this post");
    }

    if (post.authorId !== userId && user.role !== "admin") {
        throw new AppError(Kind.PermissionDenied, "You cannot delete this post");
    }

    await postsRepo.delete(postId);
}

async function getByCategory(categoryId) {
    return await transactional(_getByCategory)(categoryId);
}

async function _getByCategory(uow, categoryId) {
    const categoriesRepo = uow.categories();
    const category = await categoriesRepo.findById(categoryId);

    if (!category) {
        throw new AppError(Kind.NotFound, "Category not found");
    }

    const postsRepo = uow.posts();
    return await postsRepo.findByCategory(categoryId);
}

module.exports = {
    getAll,
    create,
    getById,
    update,
    deletePost,
    getByCategory
};
