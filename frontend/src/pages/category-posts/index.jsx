import { useParams } from "react-router";
import { getByCategoryId } from "../../api/posts";
import InfiniteScroll from "../../components/infinite-scroll";
import "./category-posts.css";

function CategoryPosts() {
    const { id } = useParams();

    return (
        <div className="category-posts-page">
            <h1>Category Posts</h1>

            <InfiniteScroll
                filters={{}}
                getPosts={params => getByCategoryId(id, params)}
            />
        </div>
    );
}

export default CategoryPosts;