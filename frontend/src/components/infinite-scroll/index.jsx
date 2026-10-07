import { useEffect, useRef, useState } from "react";
import { getById as getUserById } from "../../api/users";
import Post from "../post";
import "./infinite-scroll.css";

function InfiniteScroll({ filters = {}, getPosts }) {
    const [posts, setPosts] = useState([]);
    const [authors, setAuthors] = useState({});
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadMoreRef = useRef(null);
    const loadingRef = useRef(false);
    const authorsRef = useRef({});

    async function loadAuthors(posts) {
        const authorIds = [
            ...new Set(
                posts
                    .map(post => post.authorId)
                    .filter(authorId => !authorsRef.current[authorId])
            )
        ];

        if (authorIds.length === 0) {
            return;
        }

        const results = await Promise.allSettled(
            authorIds.map(async authorId => {
                const author = await getUserById(authorId);

                return [authorId, author];
            })
        );

        for (const result of results) {
            if (result.status === "fulfilled") {
                const [authorId, author] = result.value;

                authorsRef.current[authorId] = author;
            } else {
                console.error(
                    "Failed to load author:",
                    result.reason
                );
            }
        }

        setAuthors({ ...authorsRef.current });
    }

    async function loadMore() {
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

            await loadAuthors(response.posts);

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

                await loadAuthors(response.posts);

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
        setAuthors({});
        authorsRef.current = {};
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
                loadMore();
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
                                author={authors[post.authorId]}
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