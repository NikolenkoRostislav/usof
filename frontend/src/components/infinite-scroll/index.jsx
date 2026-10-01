import { useEffect, useRef, useState } from "react";
import Post from "../post";
import "./infinite-scroll.css";

function InfiniteScroll({ filters = {}, getPosts }) {
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

    function handlePostDelete(id) {
        setPosts(prev => prev.filter(post => post.id !== id));
    }

    useEffect(() => {
        let cancelled = false;

        async function loadInitialPosts() {
            loadingRef.current = true;
            setLoading(true);
            setError(null);

            try {
                const response = await getPosts({
                    ...filters,
                    page: 0,
                });

                if (cancelled) {
                    return;
                }

                setPosts(response.posts);
                setPage(1);
                setHasMore(response.posts.length > 0);
            } catch (error) {
                if (!cancelled) {
                    setError(error);
                }
            } finally {
                if (!cancelled) {
                    loadingRef.current = false;
                    setLoading(false);
                }
            }
        }

        setPosts([]);
        setPage(0);
        setHasMore(true);
        setError(null);

        loadInitialPosts();

        return () => {
            cancelled = true;
        };
    }, [filters]);

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
        <section className="infinite-scroll">
            <div className="infinite-scroll-architecture">
                <div className="infinite-scroll-roof">
                    <div className="infinite-scroll-roof-crown" />
                    <div className="infinite-scroll-roof-architrave" />
                    <div className="infinite-scroll-roof-frieze">
                        <span>✦</span>
                        <span className="infinite-scroll-posts-sign">
                            POSTS
                        </span>
                        <span>✦</span>
                    </div>
                    <div className="infinite-scroll-roof-cornice" />
                </div>

                <div className="infinite-scroll-columns">
                    <div className="roman-column roman-column-left">
                        <div className="column-capital">
                            <span />
                            <span />
                            <span />
                        </div>

                        <div className="column-shaft">
                            <div className="column-fluting" />
                        </div>

                        <div className="column-base">
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>

                    <div className="infinite-scroll-content">
                        {error && (
                            <p className="infinite-scroll-error">
                                Failed to load posts.
                            </p>
                        )}

                        {posts.map(post => (
                            <Post
                                key={post.id}
                                post={post}
                                onDelete={handlePostDelete}
                            />
                        ))}

                        <div
                            ref={loadMoreRef}
                            className="infinite-scroll-load-more"
                        >
                            {loading && <p>Loading...</p>}
                        </div>
                    </div>

                    <div className="roman-column roman-column-right">
                        <div className="column-capital">
                            <span />
                            <span />
                            <span />
                        </div>

                        <div className="column-shaft">
                            <div className="column-fluting" />
                        </div>

                        <div className="column-base">
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                </div>

                <div className="infinite-scroll-floor">
                    <div className="infinite-scroll-floor-step floor-step-top" />
                    <div className="infinite-scroll-floor-step floor-step-middle">
                        {!hasMore && (
                            <span className="infinite-scroll-floor-inscription">
                                NO MORE POSTS
                            </span>
                        )}
                    </div>
                    <div className="infinite-scroll-floor-step floor-step-bottom" />
                </div>
            </div>
        </section>
    );
}

export default InfiniteScroll;