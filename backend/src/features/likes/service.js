const Like = require("../../domain/entities/like");
const { transactional, getReadOnlyUoW } = require("../../infra/db/uow");
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

async function getPostLikes(postId, isAdmin, userId) {
    const uow = await getReadOnlyUoW();
    const postsRepo = uow.posts();
    const post = await postsRepo.findById(postId);

    if (!post || (post.status === "inactive" && (!isAdmin && post.authorId !== userId))) {
        throw new AppError(Kind.NotFound, "Post not found");
    }

    const likesRepo = uow.likes();
    return await likesRepo.findByPostId(postId);
}

async function getCommentLikes(commentId, isAdmin) {
    const uow = await getReadOnlyUoW();
    const commentsRepo = uow.comments();
    const comment = await commentsRepo.findById(commentId);

    if (!comment || (comment.status === "inactive" && !isAdmin)) {
        throw new AppError(Kind.NotFound, "Comment not found");
    }

    const likesRepo = uow.likes();
    return await likesRepo.findByCommentId(commentId);
}

async function getAllCommentLikes() {
    const uow = await getReadOnlyUoW();
    const likesRepo = uow.likes();
    return await likesRepo.findAllForComments();
}

async function getAllPostLikes() {
    const uow = await getReadOnlyUoW();
    const likesRepo = uow.likes();
    return await likesRepo.findAllForPosts();
}

async function deleteLike(likeId) {
    return await transactional(_deleteLike)(likeId);
}

async function _deleteLike(uow, likeId) {
    const likesRepo = uow.likes();
    const like = await likesRepo.findById(likeId);

    if (!like) {
        throw new AppError(Kind.NotFound, "Like not found");
    }

    await likesRepo.delete(likeId);
}


module.exports = {
    createPostLike,
    createCommentLike,
    deletePostLike,
    deleteCommentLike,
    getPostLikes,
    getCommentLikes,
    getAllPostLikes,
    getAllCommentLikes,
    deleteLike
};
