const categoryService = require("./service");
const { CreateCategoryRequest, UpdateCategoryRequest } = require("./requests");
const { CategoryResponse, CategoriesListResponse } = require("./responses");

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriesList'
 *       403:
 *         description: Forbidden
 */
async function getAll(req, res) {
    const categories = await categoryService.getAll();
    const response = new CategoriesListResponse(categories);
    res.json(response);
}

/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags:
 *       - Categories
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryRequest'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       403:
 *         description: Forbidden
 */
async function create(req, res) {
    const createRequest = new CreateCategoryRequest(req.body.title, req.body.description);
    const category = await categoryService.create(createRequest.title, createRequest.description);
    const response = new CategoryResponse(category);
    res.status(201).json(response);
}

/**
 * @swagger
 * /api/categories/{category_id}:
 *   get:
 *     tags:
 *       - Categories
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */
async function getById(req, res) {
    const { category_id } = req.params;
    const category = await categoryService.getById(category_id);
    const response = new CategoryResponse(category);
    res.json(response);
}

/**
 * @swagger
 * /api/categories/{category_id}:
 *   patch:
 *     tags:
 *       - Categories
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryRequest'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */
async function update(req, res) {
    const { category_id } = req.params;
    const updateRequest = new UpdateCategoryRequest(req.body.title, req.body.description);
    const category = await categoryService.update(category_id, updateRequest);
    const response = new CategoryResponse(category);
    res.json(response);
}

/**
 * @swagger
 * /api/categories/{category_id}:
 *   delete:
 *     tags:
 *       - Categories
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */
async function deleteCategory(req, res) {
    const { category_id } = req.params;
    await categoryService.deleteCategory(category_id);
    res.sendStatus(204);
}

module.exports = { getAll, create, getById, update, deleteCategory };
