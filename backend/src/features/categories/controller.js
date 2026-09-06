const categoryService = require("./service");
const { CreateCategoryRequest, UpdateCategoryRequest } = require("./requests");

async function getAll(req, res) {
    const categories = await categoryService.getAll();
    res.json(categories);
}

async function create(req, res) {
    const createRequest = new CreateCategoryRequest(req.body.title, req.body.description);
    const category = await categoryService.create(createRequest.title, createRequest.description);
    res.status(201).json(category);
}

async function getById(req, res) {
    const { category_id } = req.params;
    const category = await categoryService.getById(category_id);
    res.json(category);
}

async function update(req, res) {
    const { category_id } = req.params;
    const updateRequest = new UpdateCategoryRequest(req.body.title, req.body.description);
    const category = await categoryService.update(category_id, updateRequest);
    res.json(category);
}

async function deleteCategory(req, res) {
    const { category_id } = req.params;
    await categoryService.deleteCategory(category_id);
    res.sendStatus(204);
}

module.exports = { getAll, create, getById, update, deleteCategory };
