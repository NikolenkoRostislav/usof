const categoryService = require("./service");

async function getAll(req, res) {
    const categories = await categoryService.getAll();
    res.json(categories);
}

async function create(req, res) {
    const { title, description } = req.body;
    const category = await categoryService.create(title, description);
    res.status(201).json(category);
}

async function getById(req, res) {
    const { category_id } = req.params;
    const category = await categoryService.getById(category_id);
    res.json(category);
}

async function update(req, res) {
    const { category_id } = req.params;
    const updates = req.body;
    const category = await categoryService.update(category_id, updates);
    res.json(category);
}

async function deleteCategory(req, res) {
    const { category_id } = req.params;
    await categoryService.deleteCategory(category_id);
    res.sendStatus(204);
}

module.exports = { getAll, create, getById, update, deleteCategory };
