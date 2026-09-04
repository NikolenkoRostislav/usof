const Category = require("../../domain/entities/category");
const { transactional } = require("../../infra/db/uow");
const { AppError, Kind } = require("../../domain/errors");

async function getAll() {
    return await transactional(_getAll)();
}

async function _getAll(uow) {
    const categoriesRepo = uow.categories();
    return await categoriesRepo.findAll();
}

async function create(title, description) {
    return await transactional(_create)(title, description);
}

async function _create(uow, title, description) {
    const category = new Category({ title, description });
    const categoriesRepo = uow.categories();
    await categoriesRepo.save(category);
    return category;
}

async function getById(categoryId) {
    return await transactional(_getById)(categoryId);
}

async function _getById(uow, categoryId) {
    const categoriesRepo = uow.categories();
    const category = await categoriesRepo.findById(categoryId);

    if (!category) {
        throw new AppError(Kind.NotFound, "Category not found");
    }

    return category;
}

async function update(categoryId, updates) {
    return await transactional(_update)(categoryId, updates);
}

async function _update(uow, categoryId, updates) {
    const categoriesRepo = uow.categories();
    const category = await categoriesRepo.findById(categoryId);

    if (!category) {
        throw new AppError(Kind.NotFound, "Category not found");
    }

    if (updates.title !== undefined) {
        category.title = updates.title;
    }
    if (updates.description !== undefined) {
        category.description = updates.description;
    }

    await categoriesRepo.save(category);
    return category;
}

async function deleteCategory(categoryId) {
    return await transactional(_deleteCategory)(categoryId);
}

async function _deleteCategory(uow, categoryId) {
    const categoriesRepo = uow.categories();
    const category = await categoriesRepo.findById(categoryId);

    if (!category) {
        throw new AppError(Kind.NotFound, "Category not found");
    }

    await categoriesRepo.delete(categoryId);
}

module.exports = { getAll, create, getById, update, deleteCategory };
