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
    const likes = await likeService.getPostLikes(post_id);
    res.json(likes);
}

async function getCommentLikes(req, res) {
    const { comment_id } = req.params;
    const likes = await likeService.getCommentLikes(comment_id);
    res.json(likes);
}

module.exports = {
    createPostLike,
    createCommentLike,
    deletePostLike,
    deleteCommentLike,
    getPostLikes,
    getCommentLikes
};
