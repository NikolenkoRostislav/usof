import { useEffect, useRef, useState } from "react";
import { get as getPosts } from "../../api/posts";
import Post from "../post";
import "./infinite-scroll.css";

function InfiniteScroll({ filters = {} }) {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            const response = await getPosts({
                ...filters,
                page,
            });

            if (response.posts.length === 0) {
                setHasMore(false);
                return;
            }

            setPosts(prev => {
                const existingIds = new Set(prev.map(post => post.id));

                const newPosts = response.posts.filter(
                    post => !existingIds.has(post.id)
                );

                return [...prev, ...newPosts];
            });
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
        <div className="infinite-scroll">
            {error && (
                <p className="infinite-scroll-error">
                    Failed to load posts.
                </p>
            )}

            {posts.map(post => (
                <Post
                    key={post.id}
                    post={post}
                />
            ))}

            <div
                ref={loadMoreRef}
                className="infinite-scroll-load-more"
            >
                {loading && <p>Loading...</p>}
                {!hasMore && <p>No more posts.</p>}
            </div>
        </div>
    );
}

export default InfiniteScroll;