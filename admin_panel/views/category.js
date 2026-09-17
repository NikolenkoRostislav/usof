import { escapeHtml } from './common.js';

export function getCreateFormData() {
    return {
        title: document.getElementById('categoryName').value.trim(),
        description: document.getElementById('categoryDescription').value.trim()
    };
}

export function clearCreateForm() {
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryDescription').value = '';
}

export function renderCategories(categories) {
    const container = document.getElementById('categoriesList');

    if (categories.length === 0) {
        container.innerHTML = '<div class="no-data">No categories found</div>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${categories.map(category => `
                    <tr>
                        <td>${escapeHtml(category.id)}</td>
                        <td>${escapeHtml(category.title)}</td>
                        <td>${escapeHtml(category.description || '')}</td>
                        <td class="action-buttons">
                            <button
                                class="btn-small btn-edit"
                                onclick="openEditCategoryModal('${category.id}')">
                                Edit
                            </button>
                            <button
                                class="btn-small btn-delete"
                                onclick="deleteCategory('${category.id}')">
                                Delete
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

export function renderCategoriesError(message) {
    document.getElementById('categoriesList').innerHTML =
        `<div class="error-message">${escapeHtml(message)}</div>`;
}

export function getEditFormData() {
    return {
        id: document.getElementById('editCategoryId').value,
        title: document.getElementById('editCategoryTitle').value.trim(),
        description: document.getElementById('editCategoryDescription').value.trim()
    };
}

export function showEditModal(category) {
    document.getElementById('editCategoryId').value = category.id;
    document.getElementById('editCategoryTitle').value = category.title;
    document.getElementById('editCategoryDescription').value = category.description || '';
    document.getElementById('editCategoryModal').style.display = 'block';
}

export function closeEditModal() {
    document.getElementById('editCategoryModal').style.display = 'none';
}

export function populateCategorySelect(categories) {
    const select = document.getElementById('postCategories');

    if (!select) {
        return;
    }

    select.innerHTML = `
        <option value="" disabled>
            Select Categories (hold Ctrl to select multiple)
        </option>
    `;

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.title;

        select.appendChild(option);
    });
}