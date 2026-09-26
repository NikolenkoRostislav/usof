import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getById } from "../../api/categories";
import { getByCategoryId } from "../../api/posts";
import InfiniteScroll from "../../components/infinite-scroll";
import "./category-posts.css";

function CategoryPosts() {
    const { id } = useParams();

    const [category, setCategory] = useState(null);
    const [sortBy, setSortBy] = useState("");

    useEffect(() => {
        getById(id).then(setCategory);
    }, [id]);

    function handleSortChange(event) {
        setSortBy(event.target.value);
    }

    if (!category) {
        return (
            <div className="category-posts-page">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="category-posts-page">
            <h1>{category.title}</h1>
            <p>{category.description}</p>

            <div className="category-posts-sort">
                <label htmlFor="sortBy">Sort by</label>

                <select
                    id="sortBy"
                    value={sortBy}
                    onChange={handleSortChange}
                >
                    <option value="">Likes</option>
                    <option value="date">Last Added</option>
                </select>
            </div>

            <InfiniteScroll
                filters={{ sortBy }}
                getPosts={params => getByCategoryId(id, params)}
            />
        </div>
    );
}

export default CategoryPosts;