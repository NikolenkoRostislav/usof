import { getAll } from "../../api/favorites";
import { getById } from "../../api/posts";
import InfiniteScroll from "../../components/infinite-scroll";
import "./favorites.css";

const PAGE_SIZE = 10;

async function getFavoritePosts({ page = 0 }) {
    const { favorites } = await getAll();

    const start = page * PAGE_SIZE;
    const favoritesPage = favorites.slice(start, start + PAGE_SIZE);

    const posts = await Promise.all(
        favoritesPage.map(async favorite => {
            const post = await getById(favorite.postId);
            return post;
        })
    );

    return { posts };
}

function Favorites() {
    return (
        <div className="favorites-page">
            <InfiniteScroll getPosts={getFavoritePosts} />
        </div>
    );
}

export default Favorites;