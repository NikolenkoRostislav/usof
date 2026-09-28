import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../context/auth";
import { getById, patchById } from "../../api/posts";
import { getAll as getCategories } from "../../api/categories";
import "./edit-post.css";

function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [categories, setCategories] = useState([]);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("active");
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError(null);

                const [postData, categoriesData] = await Promise.all([
                    getById(id),
                    getCategories()
                ]);

                setPost(postData);
                setCategories(categoriesData.categories);

                setTitle(postData.title);
                setContent(postData.content);
                setStatus(postData.status);
                setSelectedCategories(
                    postData.categories.map(category => category.id)
                );
            } catch (error) {
                setError("Failed to load post.");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

    const isAuthor = user?.id === post?.authorId;
    const isAdmin = user?.role === "admin";
    const canEdit = isAuthor || isAdmin;

    function handleCategoryChange(event) {
        setSelectedCategories(prev => {
            if (prev.includes(event.target.value)) {
                return prev.filter(
                    categoryId => categoryId !== event.target.value
                );
            }

            return [...prev, event.target.value];
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError(null);
        setSubmitting(true);

        try {
            const data = {};

            if (isAuthor) {
                data.title = title;
                data.content = content;
            }

            if (isAdmin) {
                data.status = status;
                data.categories = selectedCategories;
            }

            await patchById(id, data);

            navigate(`/posts/${id}`);
        } catch (error) {
            setError("Failed to update post.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="create-post-page">
                <p>Loading...</p>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="create-post-page">
                <h1>Post not found</h1>
            </div>
        );
    }

    if (!canEdit) {
        return (
            <div className="create-post-page">
                <h1>Access denied</h1>
                <p>You do not have permission to edit this post.</p>
            </div>
        );
    }

    return (
        <div className="create-post-page">
            <form
                className="create-post-form"
                onSubmit={handleSubmit}
            >
                <h1>Edit Post</h1>

                {isAuthor && (
                    <>
                        <div className="create-post-field">
                            <label htmlFor="title">Title</label>

                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={event => setTitle(event.target.value)}
                                required
                            />
                        </div>

                        <div className="create-post-field">
                            <label htmlFor="content">Content</label>

                            <textarea
                                id="content"
                                value={content}
                                onChange={event => setContent(event.target.value)}
                                required
                                rows={10}
                            />
                        </div>
                    </>
                )}

                {isAdmin && (
                    <>
                        <div className="create-post-field">
                            <label htmlFor="status">Status</label>

                            <select
                                id="status"
                                value={status}
                                onChange={event => setStatus(event.target.value)}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="locked">Locked</option>
                            </select>
                        </div>

                        <div className="create-post-field">
                            <span>Categories</span>

                            {categories.length === 0 && (
                                <p>No categories available.</p>
                            )}

                            <div className="create-post-categories">
                                {categories.map(category => (
                                    <label
                                        key={category.id}
                                        className="create-post-category"
                                    >
                                        <input
                                            type="checkbox"
                                            value={category.id}
                                            checked={selectedCategories.includes(
                                                category.id
                                            )}
                                            onChange={handleCategoryChange}
                                        />

                                        {category.title}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {error && (
                    <p className="create-post-error">
                        {error}
                    </p>
                )}

                <div className="create-post-actions">
                    <button
                        type="button"
                        onClick={() => navigate(`/posts/${id}`)}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditPost;