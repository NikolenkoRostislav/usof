const Comment = require("../../domain/entities/comment");
const { transactional, getReadOnlyUoW } = require("../../infra/db/uow");
const { AppError, Kind } = require("../../domain/errors");

async function create(userId, postId, content, quoteId = null) {
    return await transactional(_create)(userId, postId, content, quoteId);
}

async function _create(uow, userId, postId, content, quoteId = null) {
    const postsRepo = uow.posts();
    const post = await postsRepo.findById(postId);

    if (!post) {
        throw new AppError(Kind.NotFound, "Post not found");
    }
    if (post.status !== "active") {
        throw new AppError(Kind.PermissionDenied, "Cannot comment on this post");
    }

    if (quoteId) {
        const commentsRepo = uow.comments();
        const quotedComment = await commentsRepo.findById(quoteId);

        if (!quotedComment) {
            throw new AppError(Kind.NotFound, "Quoted comment not found");
        }
        if (quotedComment.postId !== postId) {
            throw new AppError(Kind.InvalidEntry, "Quoted comment must belong to the same post");
        }
    }

    const comment = new Comment({
        authorId: userId,
        postId,
        quoteId,
        content
    });

    const commentsRepo = uow.comments();
    await commentsRepo.save(comment);
    return comment;
}

async function getAll() {
    const uow = await getReadOnlyUoW();
    const commentsRepo = uow.comments()
    return await commentsRepo.findAll()
}

async function getById(commentId) {
    const uow = await getReadOnlyUoW();
    const commentsRepo = uow.comments();
    const comment = await commentsRepo.findById(commentId);

    if (!comment || comment.status === "inactive") {
        throw new AppError(Kind.NotFound, "Comment not found");
    }

    return comment;
}

async function getByPostId(postId, isAdmin) {
    const uow = await getReadOnlyUoW();
    const postsRepo = uow.posts();
    const post = await postsRepo.findById(postId);

    if (!post) {
        throw new AppError(Kind.NotFound, "Post not found");
    }

    const commentsRepo = uow.comments();
    let comments = await commentsRepo.findByPostId(postId);
    if (!isAdmin) {
        comments = comments.filter(c => c.status === "active");
    }
    return comments
}

async function update(commentId, userId, isAdmin, updates) {
    return await transactional(_update)(commentId, userId, isAdmin, updates);
}

async function _update(uow, commentId, userId, isAdmin, updates) {
    const commentsRepo = uow.comments();
    const comment = await commentsRepo.findById(commentId);

    if (!comment) {
        throw new AppError(Kind.NotFound, "Comment not found");
    }

    if (updates.content !== undefined) {
        if (comment.authorId !== userId) {
            throw new AppError(Kind.PermissionDenied, "You cannot modify this comment");
        }
        comment.content = updates.content;
    }

    if (updates.status !== undefined) {
        if (!isAdmin && comment.authorId !== userId) {
            throw new AppError(Kind.PermissionDenied, "You cannot modify this comment's visibility");
        }
        comment.status = updates.status;
    }

    await commentsRepo.save(comment);
    return comment;
}

async function deleteComment(commentId, userId, isAdmin) {
    return await transactional(_deleteComment)(commentId, userId, isAdmin);
}

async function _deleteComment(uow, commentId, userId, isAdmin) {
    const commentsRepo = uow.comments();
    const comment = await commentsRepo.findById(commentId);

    if (!comment) {
        throw new AppError(Kind.NotFound, "Comment not found");
    }

    if (comment.authorId !== userId && !isAdmin) {
        throw new AppError(Kind.PermissionDenied, "You cannot delete this comment");
    }

    await commentsRepo.delete(commentId);
}

module.exports = {
    create,
    getById,
    getByPostId,
    update,
    deleteComment,
    getAll
};
