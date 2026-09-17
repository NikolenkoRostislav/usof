import { escapeHtml } from './common.js';

export function getCreateFormData() {
    const categorySelect = document.getElementById('postCategories');

    return {
        title: document.getElementById('postTitle').value.trim(),
        content: document.getElementById('postContent').value.trim(),
        categories: Array.from(categorySelect.selectedOptions).map(option => option.value)
    };
}

export function clearCreateForm() {
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';

    const categorySelect = document.getElementById('postCategories');

    categorySelect.selectedIndex = 0;
}

export function renderPosts(posts) {
    const container = document.getElementById('postsList');

    if (posts.length === 0) {
        container.innerHTML = '<div class="no-data">No posts found</div>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Author ID</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${posts.map(post => {
        const status = post.status || 'active';

        return `
                <tr
                    class="clickable"
                    onclick="openViewPostModal('${post.id}')">

                    <td>${escapeHtml(post.id)}</td>
                    <td>${escapeHtml(post.title)}</td>
                    <td>${escapeHtml(post.authorId)}</td>
                    <td>${escapeHtml(status)}</td>

                    <td
                        class="action-buttons"
                        onclick="event.stopPropagation()">

                        <button
                            class="btn-small btn-edit"
                            onclick="openEditPostModal('${post.id}')">
                            Edit
                        </button>

                        <button
                            class="btn-small btn-delete"
                            onclick="deletePost('${post.id}')">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
    }).join('')}
            </tbody>
        </table>
    `;
}

export function renderPostsError(message) {
    document.getElementById('postsList').innerHTML =
        `<div class="error-message">${escapeHtml(message)}</div>`;
}

export function showPostDetails(post, likeCount, categoryNames) {
    document.getElementById('viewPostId').textContent = post.id;
    document.getElementById('viewPostTitle').textContent = post.title;
    document.getElementById('viewPostAuthorId').textContent = post.authorId;
    document.getElementById('viewPostStatus').textContent = post.status || 'active';
    document.getElementById('viewPostContent').textContent = post.content;
    document.getElementById('viewPostLikes').textContent = likeCount;
    document.getElementById('viewPostCategories').textContent = categoryNames || 'No categories';
    document.getElementById('viewPostModal').style.display = 'block';
}

export function closeViewPostModal() {
    document.getElementById('viewPostModal').style.display = 'none';
}

export function getEditFormData() {
    return {
        id: document.getElementById('editPostId').value,
        status: document.getElementById('editPostStatus').value
    };
}

export function showEditPostModal(post) {
    document.getElementById('editPostId').value = post.id;
    document.getElementById('editPostStatus').value = post.status || 'active';

    document.getElementById('editPostModal').style.display = 'block';
}

export function closeEditPostModal() {
    document.getElementById('editPostModal').style.display = 'none';
}

export function renderPostCategories(categories, allCategories) {
    const container = document.getElementById('editPostCategoriesList');

    if (categories.length === 0) {
        container.innerHTML = '<div style="color: #999;">No categories selected</div>';
        return;
    }

    const categoryData = categories.map(categoryId => {
        const category = allCategories.find(
            category => category.id === categoryId
        );

        return {
            id: categoryId,
            title: category ? category.title : categoryId
        };
    });

    container.innerHTML = categoryData.map(category => `
        <span class="category-data">

            ${escapeHtml(category.title)}

            <button
                type="button"
                onclick="removePostCategory('${category.id}')"
                class="remove-post-category"
            >
                x
            </button>
        </span>
    `).join('');
}

export function populateCategoryAddSelect(
    categories,
    selectedCategoryIds
) {
    const select = document.getElementById('editPostCategoryAdd');
    select.innerHTML = '<option value="">Select a category to add</option>';

    categories.forEach(category => {
        if (selectedCategoryIds.includes(category.id)) {
            return;
        }

        const option = document.createElement('option');

        option.value = category.id;
        option.textContent = category.title;

        select.appendChild(option);
    });
}

export function getCategoryToAdd() {
    return document.getElementById('editPostCategoryAdd').value;
}

export function removeCategoryFromSelect(categoryId, category) {
    const select = document.getElementById('editPostCategoryAdd');

    const option = document.createElement('option');

    option.value = categoryId;
    option.textContent = category?.title || categoryId;

    select.appendChild(option);
}

export function removeSelectedCategoryOption() {
    const select = document.getElementById('editPostCategoryAdd');

    select.remove(select.selectedIndex);
    select.value = '';
}