const Post = require("../../domain/entities/post");
const { transactional } = require("../../infra/db/uow");
const { AppError, Kind } = require("../../domain/errors");

async function getAll(options, userId, isAdmin) {
    const uow = await getReadOnlyUoW();
    const postsRepo = uow.posts();
    const posts = await postsRepo.findAll(options);
    if (!isAdmin) {
        posts = posts.filter(p => p.status === "active" || p.authorId === userId);
    }
    return posts;
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

    if (categoryIds) {
        await postsRepo.addCategories(post.id, categoryIds);
    }

    return post;
}

async function getById(postId, isAdmin) {
    const uow = await getReadOnlyUoW();
    const postsRepo = uow.posts();
    const post = await postsRepo.findById(postId);

    if (!post || (post.status === "inactive" && !isAdmin)) {
        throw new AppError(Kind.NotFound, "Post not found");
    }

    post.categories = await postsRepo.getCategories(postId);
    return post;
}

async function update(postId, userId, isAdmin, updates) {
    return await transactional(_update)(postId, userId, isAdmin, updates);
}

async function _update(uow, postId, userId, isAdmin, updates) {
    const postsRepo = uow.posts();
    const post = await postsRepo.findById(postId);

    if (!post) {
        throw new AppError(Kind.NotFound, "Post not found");
    }

    if (updates.status !== undefined) {
        if (!isAdmin) {
            throw new AppError(Kind.PermissionDenied, "Only admins can change post status");
        }
        post.status = updates.status;
    } else {
        if (post.authorId !== userId) {
            throw new AppError(Kind.PermissionDenied, "You cannot modify this post");
        }

        if (updates.title !== undefined) {
            post.title = updates.title;
        }
        if (updates.content !== undefined) {
            post.content = updates.content;
        }
    }

    if (updates.categories !== undefined) {
        await postsRepo.updateCategories(postId, updates.categories);
        post.categories = updates.categories;
    }

    await postsRepo.save(post);
    return post;
}


async function deletePost(postId, userId, isAdmin) {
    return await transactional(_deletePost)(postId, userId, isAdmin);
}

async function _deletePost(uow, postId, userId, isAdmin) {
    const postsRepo = uow.posts();
    const post = await postsRepo.findById(postId);

    if (!post) {
        throw new AppError(Kind.NotFound, "Post not found");
    }

    if (post.authorId !== userId && !isAdmin) {
        throw new AppError(Kind.PermissionDenied, "You cannot delete this post");
    }

    await postsRepo.delete(postId);
}

async function getByCategory(categoryId, options, userId, isAdmin) {
    const uow = await getReadOnlyUoW();
    const categoriesRepo = uow.categories();
    const category = await categoriesRepo.findById(categoryId);

    if (!category) {
        throw new AppError(Kind.NotFound, "Category not found");
    }

    const postsRepo = uow.posts();
    const posts = await postsRepo.findByCategory(categoryId, options);
    if (!isAdmin) {
        posts = posts.filter(p => p.status === "active" || p.authorId === userId);
    }
    return posts;
}

module.exports = {
    getAll,
    create,
    getById,
    update,
    deletePost,
    getByCategory
};
