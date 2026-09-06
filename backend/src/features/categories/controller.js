const categoryService = require("./service");
const { CreateCategoryRequest, UpdateCategoryRequest } = require("./requests");
const { CategoryResponse, CategoriesListResponse } = require("./responses");

async function getAll(req, res) {
    const categories = await categoryService.getAll();
    const response = new CategoriesListResponse(categories);
    res.json(response);
}

async function create(req, res) {
    const createRequest = new CreateCategoryRequest(req.body.title, req.body.description);
    const category = await categoryService.create(createRequest.title, createRequest.description);
    const response = new CategoryResponse(category);
    res.status(201).json(response);
}

async function getById(req, res) {
    const { category_id } = req.params;
    const category = await categoryService.getById(category_id);
    const response = new CategoryResponse(category);
    res.json(response);
}

async function update(req, res) {
    const { category_id } = req.params;
    const updateRequest = new UpdateCategoryRequest(req.body.title, req.body.description);
    const category = await categoryService.update(category_id, updateRequest);
    const response = new CategoryResponse(category);
    res.json(response);
}

async function deleteCategory(req, res) {
    const { category_id } = req.params;
    await categoryService.deleteCategory(category_id);
    res.sendStatus(204);
}

module.exports = { getAll, create, getById, update, deleteCategory };
