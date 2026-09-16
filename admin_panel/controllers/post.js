import * as postModel from '../models/post.js';
import * as categoryModel from '../models/category.js';
import * as postView from '../views/post.js';
import { showMessage } from '../views/common.js';

let allCategories = [];
let currentPostCategories = [];

export async function loadPosts() {
    try {
        const posts = await postModel.getPosts();

        postView.renderPosts(posts);
    } catch (error) {
        postView.renderPostsError(error.message);
    }
}

export async function createPost() {
    const {
        title,
        content,
        categories
    } = postView.getCreateFormData();

    if (!title || !content) {
        alert('Post title and content are required');
        return;
    }

    try {
        await postModel.createPost(
            title,
            content,
            categories
        );

        postView.clearCreateForm();

        showMessage(
            'postsSuccess',
            'Post created successfully'
        );

        await loadPosts();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

export async function openViewPostModal(postId) {
    try {
        const post =
            await postModel.getPost(postId);

        const [
            likes,
            categories
        ] = await Promise.all([
            postModel.getPostLikes(postId),
            categoryModel.getCategories()
        ]);

        const categoryIds =
            (post.categories || []).map(category =>
                typeof category === 'string'
                    ? category
                    : category.id
            );

        const categoryNames = categoryIds
            .map(categoryId => {
                const category = categories.find(
                    category => category.id === categoryId
                );

                return category
                    ? category.title
                    : categoryId;
            })
            .join(', ');

        postView.showPostDetails(
            post,
            likes.length,
            categoryNames
        );
    } catch (error) {
        alert(
            `Error loading post details: ${error.message}`
        );
    }
}

export function closeViewPostModal() {
    postView.closeViewPostModal();
}

export async function openEditPostModal(postId) {
    try {
        const post =
            await postModel.getPost(postId);

        currentPostCategories =
            (post.categories || []).map(category =>
                typeof category === 'string'
                    ? category
                    : category.id
            );

        allCategories =
            await categoryModel.getCategories();

        postView.showEditPostModal(post);

        postView.populateCategoryAddSelect(
            allCategories,
            currentPostCategories
        );

        postView.renderPostCategories(
            currentPostCategories,
            allCategories
        );
    } catch (error) {
        alert(
            `Error loading post details: ${error.message}`
        );
    }
}

export function closeEditPostModal() {
    postView.closeEditPostModal();
}

export function addPostCategory() {
    const categoryId =
        postView.getCategoryToAdd();

    if (
        !categoryId ||
        currentPostCategories.includes(categoryId)
    ) {
        return;
    }

    currentPostCategories.push(categoryId);

    postView.removeSelectedCategoryOption();

    postView.renderPostCategories(
        currentPostCategories,
        allCategories
    );
}

export function removePostCategory(categoryId) {
    currentPostCategories =
        currentPostCategories.filter(
            id => id !== categoryId
        );

    const category =
        allCategories.find(
            category => category.id === categoryId
        );

    postView.removeCategoryFromSelect(
        categoryId,
        category
    );

    postView.renderPostCategories(
        currentPostCategories,
        allCategories
    );
}

export async function updatePost() {
    const {
        id,
        status
    } = postView.getEditFormData();

    try {
        await postModel.updatePost(
            id,
            status,
            currentPostCategories
        );

        postView.closeEditPostModal();

        showMessage(
            'postsSuccess',
            'Post updated successfully'
        );

        await loadPosts();
    } catch (error) {
        alert(
            `Failed to update post: ${error.message}`
        );
    }
}

export async function deletePost(postId) {
    if (!confirm(
        'Are you sure you want to delete this post?'
    )) {
        return;
    }

    try {
        await postModel.deletePost(postId);

        showMessage(
            'postsSuccess',
            'Post deleted successfully'
        );

        await loadPosts();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}