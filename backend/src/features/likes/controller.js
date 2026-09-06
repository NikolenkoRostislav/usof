const likeService = require("./service");

async function createPostLike(req, res) {
    const userId = req.session.user.id;
    const { post_id } = req.params;
    const { type } = req.query;

    const like = await likeService.createPostLike(userId, post_id, type);
    res.status(201).json(like);
}

async function createCommentLike(req, res) {
    const userId = req.session.user.id;
    const { comment_id } = req.params;
    const { type } = req.query;

    const like = await likeService.createCommentLike(userId, comment_id, type);
    res.status(201).json(like);
}

async function deletePostLike(req, res) {
    const userId = req.session.user.id;
    const { post_id } = req.params;

    await likeService.deletePostLike(userId, post_id);
    res.sendStatus(204);
}

async function deleteCommentLike(req, res) {
    const userId = req.session.user.id;
    const { comment_id } = req.params;

    await likeService.deleteCommentLike(userId, comment_id);
    res.sendStatus(204);
}

async function getPostLikes(req, res) {
    const { post_id } = req.params;
    const isAdmin = req.session?.user?.role === 'admin';

    const likes = await likeService.getPostLikes(post_id, isAdmin);
    res.json(likes);
}

async function getCommentLikes(req, res) {
    const { comment_id } = req.params;
    const isAdmin = req.session?.user?.role === 'admin';

    const likes = await likeService.getCommentLikes(comment_id, isAdmin);
    res.json(likes);
}

async function getAllPostLikes(req, res) {
    const { post_id } = req.params;
    const likes = await likeService.getAllPostLikes(post_id);
    res.json(likes);
}

async function getAllCommentLikes(req, res) {
    const { comment_id } = req.params;
    const likes = await likeService.getAllCommentLikes(comment_id);
    res.json(likes);
}

async function deleteLike(req, res) {
    const { post_id } = req.params;
    await likeService.deleteLike(post_id);
    res.sendStatus(204);
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
