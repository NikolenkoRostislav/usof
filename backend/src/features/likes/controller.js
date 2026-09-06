const likeService = require("./service");
const { CreatePostLikeRequest, CreateCommentLikeRequest } = require("./requests");
const { LikeResponse, LikesListResponse } = require("./responses");

async function createPostLike(req, res) {
    const userId = req.session.user.id;
    const { post_id } = req.params;
    const likeRequest = new CreatePostLikeRequest(req.body.type);

    const like = await likeService.createPostLike(userId, post_id, likeRequest.type);
    const response = new LikeResponse(like);
    res.status(201).json(response);
}

async function createCommentLike(req, res) {
    const userId = req.session.user.id;
    const { comment_id } = req.params;
    const likeRequest = new CreateCommentLikeRequest(req.body.type);

    const like = await likeService.createCommentLike(userId, comment_id, likeRequest.type);
    const response = new LikeResponse(like);
    res.status(201).json(response);
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
    const response = new LikesListResponse(likes);
    res.json(response);
}

async function getCommentLikes(req, res) {
    const { comment_id } = req.params;
    const isAdmin = req.session?.user?.role === 'admin';

    const likes = await likeService.getCommentLikes(comment_id, isAdmin);
    const response = new LikesListResponse(likes);
    res.json(response);
}

async function getAllPostLikes(req, res) {
    const likes = await likeService.getAllPostLikes();
    const response = new LikesListResponse(likes);
    res.json(response);
}

async function getAllCommentLikes(req, res) {
    const likes = await likeService.getAllCommentLikes();
    const response = new LikesListResponse(likes);
    res.json(response);
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
