const postService = require("./service");

async function getAll(req, res) {
    const posts = await postService.getAll();
    res.json(posts);
}

async function create(req, res) {
    const userId = req.session.user.id;
    const { title, content, categories } = req.body;

    const post = await postService.create(userId, title, content, categories);
    res.status(201).json(post);
}

async function getById(req, res) {
    const { post_id } = req.params;
    const post = await postService.getById(post_id);
    res.json(post);
}

async function update(req, res) {
    const userId = req.session.user.id;
    const { post_id } = req.params;
    const updates = req.body;

    const post = await postService.update(post_id, userId, updates);
    res.json(post);
}

async function deletePost(req, res) {
    const userId = req.session.user.id;
    const { post_id } = req.params;

    await postService.deletePost(post_id, userId);
    res.sendStatus(204);
}

async function getByCategory(req, res) {
    const { category_id } = req.params;
    const posts = await postService.getByCategory(category_id);
    res.json(posts);
}

module.exports = { getAll, create, getById, update, deletePost, getByCategory };
