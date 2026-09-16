import * as authController from './controllers/auth.js';
import * as categoryController from './controllers/category.js';
import * as awardController from './controllers/award.js';
import * as userController from './controllers/user.js';
import * as commentController from './controllers/comment.js';
import * as likeController from './controllers/like.js';
import * as postController from './controllers/post.js';

import {
    switchTab,
    setupModalClose
} from './views/common.js';

async function loadAllData() {
    await Promise.all([
        categoryController.loadCategories(),
        postController.loadPosts(),
        awardController.loadAwards(),
        userController.loadUsers(),
        commentController.loadComments(),
        likeController.loadLikes()
    ]);
}

document.addEventListener('DOMContentLoaded', async () => {
    document
        .getElementById('loginForm')
        .addEventListener('submit', async event => {
            event.preventDefault();

            const loggedIn =
                await authController.login();

            if (loggedIn) {
                await loadAllData();
            }
        });

    setupModalClose(
        'viewPostModal',
        postController.closeViewPostModal
    );

    setupModalClose(
        'editPostModal',
        postController.closeEditPostModal
    );

    setupModalClose(
        'editUserModal',
        userController.closeEditUserModal
    );

    setupModalClose(
        'editCategoryModal',
        categoryController.closeEditCategoryModal
    );

    const loggedIn =
        await authController.initialize();

    if (!loggedIn) {
        return;
    }

    await loadAllData();
});

window.logout = authController.logout;
window.switchTab = switchTab;

window.createCategory = categoryController.createCategory;
window.deleteCategory = categoryController.deleteCategory;
window.openEditCategoryModal = categoryController.openEditCategoryModal;
window.closeEditCategoryModal = categoryController.closeEditCategoryModal;
window.updateCategory = categoryController.updateCategory;

window.createAward = awardController.createAward;
window.deleteAward = awardController.deleteAward;

window.createUser = userController.createUser;
window.openEditUserModal = userController.openEditUserModal;
window.closeEditUserModal = userController.closeEditUserModal;
window.updateUser = userController.updateUser;
window.deleteUser = userController.deleteUser;

window.loadComments = commentController.loadComments;
window.toggleCommentStatus = commentController.toggleCommentStatus;
window.deleteComment = commentController.deleteComment;

window.deleteLike = likeController.deleteLike;
window.loadLikes = likeController.loadLikes;

window.createPost = postController.createPost;
window.openViewPostModal = postController.openViewPostModal;
window.closeViewPostModal = postController.closeViewPostModal;
window.openEditPostModal = postController.openEditPostModal;
window.closeEditPostModal = postController.closeEditPostModal;
window.updatePost = postController.updatePost;
window.deletePost = postController.deletePost;
window.addPostCategory = postController.addPostCategory;
window.removePostCategory = postController.removePostCategory;
