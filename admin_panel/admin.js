const API_URL = 'http://localhost:3000/api';

function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadAllData();
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

// Check if session is active
async function checkActiveSession() {
    try {
        const response = await fetch(`${API_URL}/users/me`, {
            credentials: 'include'
        });

        if (response.ok) {
            return true;
        }
    } catch (error) {
        console.error('Session check failed:', error);
    }
    return false;
}

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login: username, password })
        });

        if (response.ok) {
            document.getElementById('loginForm').reset();
            loginError.style.display = 'none';
            showDashboard();
        } else {
            loginError.textContent = 'Invalid credentials or not an admin';
            loginError.style.display = 'block';
            document.getElementById('loginForm').reset();
        }
    } catch (error) {
        loginError.textContent = 'Login failed: ' + error.message;
        loginError.style.display = 'block';
        document.getElementById('loginForm').reset();
    }
});

// Logout
async function logout() {
    try {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        showLoginPage();
        document.getElementById('loginForm').reset();
        document.getElementById('loginError').style.display = 'none';
    } catch (error) {
        console.error('Logout failed:', error);
        showLoginPage();
    }
}

// Categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to load categories');

        const data = await response.json();
        const categories = data.categories || [];
        let html = '<table><thead><tr><th>Title</th><th>Description</th><th>Actions</th></tr></thead><tbody>';

        if (categories.length === 0) {
            html = '<div class="no-data">No categories found</div>';
        } else {
            categories.forEach(cat => {
                html += `<tr>
                    <td>${escapeHtml(cat.title)}</td>
                    <td>${escapeHtml(cat.description || '')}</td>
                    <td class="action-buttons">
                        <button class="btn-small btn-delete" onclick="deleteCategory('${cat.id}')">Delete</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table>';
        }

        document.getElementById('categoriesList').innerHTML = html;
    } catch (error) {
        document.getElementById('categoriesList').innerHTML = '<div class="error-message">' + error.message + '</div>';
    }
}

async function createCategory() {
    const title = document.getElementById('categoryName').value.trim();
    const description = document.getElementById('categoryDescription').value.trim();

    if (!title) {
        alert('Category title is required');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        });

        if (response.ok) {
            document.getElementById('categoryName').value = '';
            document.getElementById('categoryDescription').value = '';
            showMessage('categoriesSuccess', 'Category created successfully');
            loadCategories();
        } else {
            alert('Failed to create category');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function deleteCategory(categoryId) {
    if (!confirm('Are you sure?')) return;

    try {
        const response = await fetch(`${API_URL}/categories/${categoryId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            showMessage('categoriesSuccess', 'Category deleted successfully');
            loadCategories();
        } else {
            alert('Failed to delete category');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Awards
async function loadAwards() {
    try {
        const response = await fetch(`${API_URL}/awards`, {
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to load awards');

        const data = await response.json();
        const awards = data.awards || [];
        let html = '<table><thead><tr><th>Title</th><th>Description</th><th>Rarity</th><th>Actions</th></tr></thead><tbody>';

        if (awards.length === 0) {
            html = '<div class="no-data">No awards found</div>';
        } else {
            awards.forEach(award => {
                html += `<tr>
                    <td>${escapeHtml(award.title)}</td>
                    <td>${escapeHtml(award.description || '')}</td>
                    <td>${escapeHtml(award.rarity || '')}</td>
                    <td class="action-buttons">
                        <button class="btn-small btn-delete" onclick="deleteAward('${award.id}')">Delete</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table>';
        }

        document.getElementById('awardsList').innerHTML = html;
    } catch (error) {
        document.getElementById('awardsList').innerHTML = '<div class="error-message">' + error.message + '</div>';
    }
}

async function createAward() {
    const title = document.getElementById('awardName').value.trim();
    const description = document.getElementById('awardDescription').value.trim();
    const rarity = document.getElementById('awardRarity')?.value || 'common';

    if (!title) {
        alert('Award title is required');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/awards`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, rarity })
        });

        if (response.ok) {
            document.getElementById('awardName').value = '';
            document.getElementById('awardDescription').value = '';
            if (document.getElementById('awardRarity')) {
                document.getElementById('awardRarity').value = 'common';
            }
            showMessage('awardsSuccess', 'Award created successfully');
            loadAwards();
        } else {
            alert('Failed to create award');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function deleteAward(awardId) {
    if (!confirm('Are you sure?')) return;

    try {
        const response = await fetch(`${API_URL}/awards/${awardId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            showMessage('awardsSuccess', 'Award deleted successfully');
            loadAwards();
        } else {
            alert('Failed to delete award');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Users
async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users`, {
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to load users');

        const data = await response.json();
        const users = data.users || [];
        let html = '<table><thead><tr><th>Login</th><th>Full Name</th><th>Role</th><th>Actions</th></tr></thead><tbody>';

        if (users.length === 0) {
            html = '<div class="no-data">No users found</div>';
        } else {
            users.forEach(user => {
                html += `<tr>
                    <td>${escapeHtml(user.login)}</td>
                    <td>${escapeHtml(user.fullName || '')}</td>
                    <td>${escapeHtml(user.role)}</td>
                    <td class="action-buttons">
                        <button class="btn-small btn-edit" onclick="openEditUserModal('${user.id}')">Edit</button>
                        <button class="btn-small btn-delete" onclick="deleteUser('${user.id}')">Delete</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table>';
        }

        document.getElementById('usersList').innerHTML = html;
    } catch (error) {
        document.getElementById('usersList').innerHTML = '<div class="error-message">' + error.message + '</div>';
    }
}

async function createUser() {
    const email = document.getElementById('newUserEmail').value.trim();
    const password = document.getElementById('newUserPassword').value.trim();
    const login = document.getElementById('newUserLogin').value.trim();
    const fullName = document.getElementById('newUserFullName').value.trim();
    const role = document.getElementById('newUserRole')?.value || 'user';

    if (!email || !password || !login || !fullName) {
        alert('All fields are required');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, login, fullName, role })
        });

        if (response.ok) {
            document.getElementById('newUserEmail').value = '';
            document.getElementById('newUserPassword').value = '';
            document.getElementById('newUserLogin').value = '';
            document.getElementById('newUserFullName').value = '';
            document.getElementById('newUserRole').value = 'user';
            showMessage('usersSuccess', 'User created successfully');
            loadUsers();
        } else {
            const errorData = await response.json();
            alert('Failed to create user: ' + (errorData.message || 'Unknown error'));
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function openEditUserModal(userId) {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to load user details');

        const user = await response.json();
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserLogin').value = user.login;
        document.getElementById('editUserFullName').value = user.fullName;
        document.getElementById('editUserModal').style.display = 'block';
    } catch (error) {
        alert('Error loading user details: ' + error.message);
    }
}

function closeEditUserModal() {
    document.getElementById('editUserModal').style.display = 'none';
}

async function updateUser() {
    const userId = document.getElementById('editUserId').value;
    const login = document.getElementById('editUserLogin').value.trim();
    const fullName = document.getElementById('editUserFullName').value.trim();

    if (!login || !fullName) {
        alert('Login and full name are required');
        return;
    }

    try {
        const updateData = { login, fullName };

        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        if (response.ok) {
            showMessage('usersSuccess', 'User updated successfully');
            closeEditUserModal();
            loadUsers();
        } else {
            const errorData = await response.json();
            alert('Failed to update user: ' + (errorData.message || 'Unknown error'));
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;

    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            showMessage('usersSuccess', 'User deleted successfully');
            loadUsers();
        } else {
            const errorData = await response.json();
            alert('Failed to delete user: ' + (errorData.message || 'Unknown error'));
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Comments
async function loadComments() {
    try {
        const response = await fetch(`${API_URL}/comments`, {
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to load comments');

        const data = await response.json();
        const comments = data.comments || [];
        let html = '<table><thead><tr><th>ID</th><th>Author ID</th><th>Content</th><th>Post ID</th><th>Status</th></tr></thead><tbody>';

        if (comments.length === 0) {
            html = '<div class="no-data">No comments found</div>';
        } else {
            comments.forEach(comment => {
                html += `<tr>
                    <td>${escapeHtml(comment.id)}</td>
                    <td>${escapeHtml(comment.authorId)}</td>
                    <td>${escapeHtml((comment.content || '').substring(0, 50))}...</td>
                    <td>${escapeHtml(comment.postId)}</td>
                    <td>${escapeHtml(comment.status || 'active')}</td>
                </tr>`;
            });
            html += '</tbody></table>';
        }

        document.getElementById('commentsList').innerHTML = html;
    } catch (error) {
        document.getElementById('commentsList').innerHTML = '<div class="error-message">' + error.message + '</div>';
    }
}

// Likes
async function loadLikes() {
    try {
        const postLikesResponse = await fetch(`${API_URL}/posts/likes`, {
            credentials: 'include'
        });
        const commentLikesResponse = await fetch(`${API_URL}/comments/likes`, {
            credentials: 'include'
        });

        if (!postLikesResponse.ok || !commentLikesResponse.ok) {
            throw new Error('Failed to load likes');
        }

        const postLikesData = await postLikesResponse.json();
        const commentLikesData = await commentLikesResponse.json();
        const postLikes = postLikesData.likes || [];
        const commentLikes = commentLikesData.likes || [];

        let postHtml = '<table><thead><tr><th>ID</th><th>Post ID</th><th>Author ID</th><th>Type</th><th>Actions</th></tr></thead><tbody>';
        if (postLikes.length === 0) {
            postHtml = '<div class="no-data">No post likes found</div>';
        } else {
            postLikes.forEach(like => {
                postHtml += `<tr>
                    <td>${escapeHtml(like.id)}</td>
                    <td>${escapeHtml(like.postId)}</td>
                    <td>${escapeHtml(like.authorId)}</td>
                    <td>${escapeHtml(like.type || 'like')}</td>
                    <td class="action-buttons">
                        <button class="btn-small btn-delete" onclick="deleteLike('${like.id}')">Delete</button>
                    </td>
                </tr>`;
            });
            postHtml += '</tbody></table>';
        }

        let commentHtml = '<table><thead><tr><th>ID</th><th>Comment ID</th><th>Author ID</th><th>Type</th><th>Actions</th></tr></thead><tbody>';
        if (commentLikes.length === 0) {
            commentHtml = '<div class="no-data">No comment likes found</div>';
        } else {
            commentLikes.forEach(like => {
                commentHtml += `<tr>
                    <td>${escapeHtml(like.id)}</td>
                    <td>${escapeHtml(like.commentId)}</td>
                    <td>${escapeHtml(like.authorId)}</td>
                    <td>${escapeHtml(like.type || 'like')}</td>
                    <td class="action-buttons">
                        <button class="btn-small btn-delete" onclick="deleteLike('${like.id}')">Delete</button>
                    </td>
                </tr>`;
            });
            commentHtml += '</tbody></table>';
        }

        document.getElementById('postLikesList').innerHTML = postHtml;
        document.getElementById('commentLikesList').innerHTML = commentHtml;
    } catch (error) {
        document.getElementById('postLikesList').innerHTML = '<div class="error-message">' + error.message + '</div>';
        document.getElementById('commentLikesList').innerHTML = '<div class="error-message">' + error.message + '</div>';
    }
}

async function deleteLike(likeId) {
    if (!confirm('Are you sure?')) return;

    try {
        const response = await fetch(`${API_URL}/likes/${likeId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            loadLikes();
        } else {
            alert('Failed to delete like');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Load all data
function loadAllData() {
    loadCategories();
    loadAwards();
    loadUsers();
    loadComments();
    loadLikes();
}

// Utility functions
function showMessage(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('editUserModal');
    if (event.target === modal) {
        closeEditUserModal();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const isLoggedIn = await checkActiveSession();
    if (isLoggedIn) {
        showDashboard();
    } else {
        showLoginPage();
    }
});
