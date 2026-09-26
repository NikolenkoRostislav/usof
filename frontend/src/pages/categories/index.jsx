import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAll } from "../../api/categories";
import "./categories.css";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAll()
            .then(data => setCategories(data.categories))
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="categories-page">
                <h1>Categories</h1>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="categories-page">
                <h1>Categories</h1>
                <p className="categories-error">
                    {error.message}
                </p>
            </div>
        );
    }

    return (
        <div className="categories-page">
            <h1>Categories</h1>

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