const commentService = require("./service");
const { CreateCommentRequest, UpdateCommentRequest } = require("./requests");
const { CommentResponse, CommentsListResponse } = require("./responses");

async function create(req, res) {
    const userId = req.session.user.id;
    const { post_id } = req.params;
    const createRequest = new CreateCommentRequest(req.body.content);

    const comment = await commentService.create(userId, post_id, createRequest.content);
    const response = new CommentResponse(comment);
    res.status(201).json(response);
}

async function getById(req, res) {
    const { comment_id } = req.params;
    const comment = await commentService.getById(comment_id);
    const response = new CommentResponse(comment);
    res.json(response);
}

async function getByPostId(req, res) {
    const { post_id } = req.params;
    const isAdmin = req.session?.user?.role === 'admin';

    const comments = await commentService.getByPostId(post_id, isAdmin);
    const response = new CommentsListResponse(comments);
    res.json(response);
}

async function update(req, res) {
    const userId = req.session.user.id;
    const isAdmin = req.session.user.role === 'admin';
    const { comment_id } = req.params;
    const updateRequest = new UpdateCommentRequest(req.body.content, req.body.status);

    const comment = await commentService.update(comment_id, userId, isAdmin, updateRequest);
    const response = new CommentResponse(comment);
    res.json(response);
}

async function deleteComment(req, res) {
    const userId = req.session.user.id;
    const isAdmin = req.session.user.role === 'admin';
    const { comment_id } = req.params;

    await commentService.deleteComment(comment_id, userId, isAdmin);
    res.sendStatus(204);
}

async function getAll(req, res) {
    const comments = await commentService.getAll();
    const response = new CommentsListResponse(comments);
    res.json(response);
}

module.exports = { create, getById, getByPostId, update, deleteComment, getAll };
