const postService = require("./service");

async function getAll(req, res) {
    const sortBy = req.query.sortBy || 'likes';
    const categories = req.query.categories ? req.query.categories.split(',') : [];
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const page = parseInt(req.query.page) || 0;
    const limit = 20;
    const isAdmin = req.session?.user?.role === 'admin';

    const posts = await postService.getAll({ sortBy, categories, fromDate, toDate, page, limit, isAdmin });
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
    const isAdmin = req.session?.user?.role === 'admin';

    const post = await postService.getById(post_id, isAdmin);
    res.json(post);
}

async function update(req, res) {
    const userId = req.session.user.id;
    const isAdmin = req.session.user.role === 'admin';
    const { post_id } = req.params;
    const updates = req.body;

    const post = await postService.update(post_id, userId, isAdmin, updates);
    res.json(post);
}

async function deletePost(req, res) {
    const userId = req.session.user.id;
    const isAdmin = req.session.user.role === 'admin';
    const { post_id } = req.params;

    await postService.deletePost(post_id, userId, isAdmin);
    res.sendStatus(204);
}

async function getByCategory(req, res) {
    const { category_id } = req.params;
    const sortBy = req.query.sortBy || 'likes';
    const page = parseInt(req.query.page) || 0;
    const limit = 20;
    const isAdmin = req.session?.user?.role === 'admin';

    const posts = await postService.getByCategory(category_id, { sortBy, page, limit, isAdmin });
    res.json(posts);
}

module.exports = { getAll, create, getById, update, deletePost, getByCategory };
