const commentService = require("./service");
const { CreateCommentRequest, UpdateCommentRequest } = require("./requests");

async function create(req, res) {
    const userId = req.session.user.id;
    const { post_id } = req.params;
    const createRequest = new CreateCommentRequest(req.body.content);

    const comment = await commentService.create(userId, post_id, createRequest.content);
    res.status(201).json(comment);
}

async function getById(req, res) {
    const { comment_id } = req.params;
    const comment = await commentService.getById(comment_id);
    res.json(comment);
}

async function getByPostId(req, res) {
    const { post_id } = req.params;
    const isAdmin = req.session?.user?.role === 'admin';

    const comments = await commentService.getByPostId(post_id, isAdmin);
    res.json(comments);
}

async function update(req, res) {
    const userId = req.session.user.id;
    const isAdmin = req.session.user.role === 'admin';
    const { comment_id } = req.params;
    const updateRequest = new UpdateCommentRequest(req.body.content, req.body.status);

    const comment = await commentService.update(comment_id, userId, isAdmin, updateRequest);
    res.json(comment);
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
    res.json(comments);
}

module.exports = { create, getById, getByPostId, update, deleteComment, getAll };
