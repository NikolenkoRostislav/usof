import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/auth";
import { getAll, post } from "../../api/categories";
import "./categories.css";

function Categories() {
    const { user } = useAuth();

    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const isAdmin = user?.role === "admin";

    async function loadCategories() {
        const data = await getAll();
        setCategories(data.categories);
    }

    useEffect(() => {
        loadCategories()
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        setError(null);
        setSubmitting(true);

        try {
            await post(title, description);

            await loadCategories();

            setTitle("");
            setDescription("");
        } catch (error) {
            setError("Failed to create category.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="categories-page">
                <h1>Categories</h1>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="categories-page">
            <h1>Categories</h1>

            {isAdmin && (
                <form
                    className="category-create"
                    onSubmit={handleSubmit}
                >
                    <h2>Create Category</h2>

                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                        required
                    />

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={event => setDescription(event.target.value)}
                        required
                        rows={3}
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? "Creating..." : "Create"}
                    </button>
                </form>
            )}

            {error && (
                <p className="categories-error">
                    {error.message || error}
                </p>
            )}

            <div className="categories-list">
                {categories.map(category => (
                    <Link
                        key={category.id}
                        to={`/posts/category/${category.id}`}
                        className="category"
                    >
                        <h2>{category.title}</h2>
                        <p>{category.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Categories;