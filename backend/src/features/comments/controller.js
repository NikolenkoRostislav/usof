const commentService = require("./service");
const { CreateCommentRequest, UpdateCommentRequest } = require("./requests");
const { CommentResponse, CommentsListResponse } = require("./responses");

/**
 * @swagger
 * /api/posts/{post_id}/comments:
 *   post:
 *     tags:
 *       - Comments
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentRequest'
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
async function create(req, res) {
    const userId = req.session.user.id;
    const { post_id } = req.params;
    const createRequest = new CreateCommentRequest(req.body.content);

    const comment = await commentService.create(userId, post_id, createRequest.content);
    const response = new CommentResponse(comment);
    res.status(201).json(response);
}

/**
 * @swagger
 * /api/comments/{comment_id}:
 *   get:
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Comment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 */
async function getById(req, res) {
    const { comment_id } = req.params;
    const comment = await commentService.getById(comment_id);
    const response = new CommentResponse(comment);
    res.json(response);
}

/**
 * @swagger
 * /api/posts/{post_id}/comments:
 *   get:
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentsList'
 *       404:
 *         description: Post not found
 */
async function getByPostId(req, res) {
    const { post_id } = req.params;
    const isAdmin = req.session?.user?.role === 'admin';

    const comments = await commentService.getByPostId(post_id, isAdmin);
    const response = new CommentsListResponse(comments);
    res.json(response);
}

/**
 * @swagger
 * /api/comments/{comment_id}:
 *   patch:
 *     tags:
 *       - Comments
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCommentRequest'
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Comment not found
 */
async function update(req, res) {
    const userId = req.session.user.id;
    const isAdmin = req.session.user.role === 'admin';
    const { comment_id } = req.params;
    const updateRequest = new UpdateCommentRequest(req.body.content, req.body.status);

    const comment = await commentService.update(comment_id, userId, isAdmin, updateRequest);
    const response = new CommentResponse(comment);
    res.json(response);
}

/**
 * @swagger
 * /api/comments/{comment_id}:
 *   delete:
 *     tags:
 *       - Comments
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 */
async function deleteComment(req, res) {
    const userId = req.session.user.id;
    const isAdmin = req.session.user.role === 'admin';
    const { comment_id } = req.params;

    await commentService.deleteComment(comment_id, userId, isAdmin);
    res.sendStatus(204);
}

/**
 * @swagger
 * /api/comments:
 *   get:
 *     tags:
 *       - Comments
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of all comments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentsList'
 *       403:
 *         description: Forbidden
 */
async function getAll(req, res) {
    const comments = await commentService.getAll();
    const response = new CommentsListResponse(comments);
    res.json(response);
}

module.exports = { create, getById, getByPostId, update, deleteComment, getAll };
