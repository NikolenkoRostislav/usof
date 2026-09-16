import * as categoryModel from '../models/category.js';
import * as categoryView from '../views/category.js';
import { showMessage } from '../views/common.js';

let categories = [];

export async function loadCategories() {
    try {
        categories = await categoryModel.getCategories();

        categoryView.renderCategories(categories);
        categoryView.populateCategorySelect(categories);
    } catch (error) {
        categoryView.renderCategoriesError(error.message);
    }
}

export async function createCategory() {
    const { title, description } =
        categoryView.getCreateFormData();

    if (!title) {
        alert('Category title is required');
        return;
    }

    try {
        await categoryModel.createCategory(title, description);

        categoryView.clearCreateForm();

        showMessage(
            'categoriesSuccess',
            'Category created successfully'
        );

        await loadCategories();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

export async function openEditCategoryModal(categoryId) {
    try {
        const category =
            await categoryModel.getCategory(categoryId);

        categoryView.showEditModal(category);
    } catch (error) {
        alert(
            `Error loading category details: ${error.message}`
        );
    }
}

export function closeEditCategoryModal() {
    categoryView.closeEditModal();
}

export async function updateCategory() {
    const {
        id,
        title,
        description
    } = categoryView.getEditFormData();

    if (!title) {
        alert('Category title is required');
        return;
    }

    try {
        await categoryModel.updateCategory(
            id,
            title,
            description
        );

        categoryView.closeEditModal();

        showMessage(
            'categoriesSuccess',
            'Category updated successfully'
        );

        await loadCategories();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

export async function deleteCategory(categoryId) {
    if (!confirm('Are you sure?')) {
        return;
    }

    try {
        await categoryModel.deleteCategory(categoryId);

        showMessage(
            'categoriesSuccess',
            'Category deleted successfully'
        );

        await loadCategories();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}