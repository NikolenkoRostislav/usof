const Like = require("../../domain/entities/like");
const { transactional } = require("../../infra/db/uow");
const { AppError, Kind } = require("../../domain/errors");

async function createPostLike(userId, postId, type) {
    return await transactional(_createPostLike)(userId, postId, type);
}

async function _createPostLike(uow, userId, postId, type) {
    if (!['like', 'dislike'].includes(type)) {
        throw new AppError(Kind.InvalidEntry, "Type must be 'like' or 'dislike'");
    }

    const postsRepo = uow.posts();
    const post = await postsRepo.findById(postId);

    if (!post) {
        throw new AppError(Kind.NotFound, "Post not found");
    }

    const like = new Like({
        authorId: userId,
        type,
        postId
    });

    const likesRepo = uow.likes();
    const existingLike = await likesRepo.findByAuthorAndPost(userId, postId);
    if (existingLike) {
        like.id = existingLike.id;
    }

    await likesRepo.save(like);
    return like;
}

async function createCommentLike(userId, commentId, type) {
    return await transactional(_createCommentLike)(userId, commentId, type);
}

async function _createCommentLike(uow, userId, commentId, type) {
    if (!['like', 'dislike'].includes(type)) {
        throw new AppError(Kind.BadRequest, "Type must be 'like' or 'dislike'");
    }

    const commentsRepo = uow.comments();
    const comment = await commentsRepo.findById(commentId);

    if (!comment) {
        throw new AppError(Kind.NotFound, "Comment not found");
    }

    const like = new Like({
        authorId: userId,
        type,
        commentId
    });

    const likesRepo = uow.likes();
    const existingLike = await likesRepo.findByAuthorAndComment(userId, commentId);

    if (existingLike) {
        like.id = existingLike.id;
    }

    await likesRepo.save(like);
    return like;
}

async function deletePostLike(userId, postId) {
    return await transactional(_deletePostLike)(userId, postId);
}

async function _deletePostLike(uow, userId, postId) {
    const likesRepo = uow.likes();
    const like = await likesRepo.findByAuthorAndPost(userId, postId);

    if (!like) {
        throw new AppError(Kind.NotFound, "Like not found");
    }

    await likesRepo.delete(like.id);
}

async function deleteCommentLike(userId, commentId) {
    return await transactional(_deleteCommentLike)(userId, commentId);
}

async function _deleteCommentLike(uow, userId, commentId) {
    const likesRepo = uow.likes();
    const like = await likesRepo.findByAuthorAndComment(userId, commentId);

    if (!like) {
        throw new AppError(Kind.NotFound, "Like not found");
    }

    await likesRepo.delete(like.id);
}

async function getPostLikes(postId) {
    return await transactional(_getPostLikes)(postId);
}

async function _getPostLikes(uow, postId) {
    const postsRepo = uow.posts();
    const post = await postsRepo.findById(postId);

    if (!post) {
        throw new AppError(Kind.NotFound, "Post not found");
    }

    const likesRepo = uow.likes();
    return await likesRepo.findByPostId(postId);
}

async function getCommentLikes(commentId) {
    return await transactional(_getCommentLikes)(commentId);
}

async function _getCommentLikes(uow, commentId) {
    const commentsRepo = uow.comments();
    const comment = await commentsRepo.findById(commentId);

    if (!comment) {
        throw new AppError(Kind.NotFound, "Comment not found");
    }

    const likesRepo = uow.likes();
    return await likesRepo.findByCommentId(commentId);
}

module.exports = {
    createPostLike,
    createCommentLike,
    deletePostLike,
    deleteCommentLike,
    getPostLikes,
    getCommentLikes
};
