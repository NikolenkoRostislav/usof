import { useEffect, useRef, useState } from "react";
import { get as getPosts } from "../../api/posts";
import Post from "../../components/post";
import "./home.css";

function Home() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadMoreRef = useRef(null);
    const loadingRef = useRef(false);

    async function loadPosts() {
        if (loadingRef.current || !hasMore) {
            return;
        }

        loadingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const response = await getPosts({ page });

            if (response.posts.length === 0) {
                setHasMore(false);
                return;
            }

            setPosts(prev => [...prev, ...response.posts]);
            setPage(prev => prev + 1);
        } catch (error) {
            setError(error);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPosts();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                loadPosts();
            }
        });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    });

    return (
        <div className="home-page">
            <h1>Posts</h1>

            {error && (
                <p className="home-error">
                    Failed to load posts.
                </p>
            )}

            <div className="home-posts">
                {posts.map(post => (
                    <Post
                        key={post.id}
                        post={post}
                    />
                ))}
            </div>

            <div
                ref={loadMoreRef}
                className="home-load-more"
            >
                {loading && <p>Loading...</p>}
                {!hasMore && <p>No more posts.</p>}
            </div>
        </div>
    );
}

export default Home;