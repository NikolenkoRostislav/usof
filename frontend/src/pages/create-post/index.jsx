import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { post } from "../../api/posts";
import { getAll as getCategories } from "../../api/categories";
import "./create-post.css";

function CreatePost() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCategories()
            .then(response => setCategories(response.categories))
            .catch(() => setError("Failed to load categories."))
            .finally(() => setLoading(false));
    }, []);

    function handleCategoryChange(event) {
        setSelectedCategories(prev => {
            if (prev.includes(event.target.value)) {
                return prev.filter(categoryId => categoryId !== event.target.value);
            }

            return [...prev, event.target.value];
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError(null);
        setSubmitting(true);

        try {
            await post(title, content, selectedCategories);
            navigate("/");
        } catch (error) {
            setError("Failed to create post.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="create-post-page">
            <form className="create-post-form" onSubmit={handleSubmit}>
                <h1>Create Post</h1>

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

                <div className="create-post-field">
                    <span>Categories</span>

                    {loading && <p>Loading categories...</p>}

                    {!loading && categories.length === 0 && (
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
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={handleCategoryChange}
                                />
                                {category.title}
                            </label>
                        ))}
                    </div>
                </div>

                {error && (
                    <p className="create-post-error">
                        {error}
                    </p>
                )}

                <div className="create-post-actions">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={submitting || loading}
                    >
                        {submitting ? "Creating..." : "Create Post"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreatePost;