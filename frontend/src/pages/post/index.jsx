import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../context/auth";
import { getById as getPostById } from "../../api/posts";
import { getById as getUserById } from "../../api/users";
import { getByPostId as getLikesByPostId } from "../../api/likes";
import { getByPostId as getAwardsByPostId, getAwards as getAllAwards } from "../../api/awards";
import Comments from "./comments";
import Reactions from "./reactions";
import "./post.css";

function Post() {
    const { id } = useParams();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [author, setAuthor] = useState(null);
    const [likes, setLikes] = useState([]);
    const [awards, setAwards] = useState([]);
    const [allAwardsData, setAllAwardsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadPost() {
            try {
                setLoading(true);
                setError(null);

                const postData = await getPostById(id);

                const [authorData, likesData, awardsData, allAwardsData] = await Promise.all([
                    getUserById(postData.authorId),
                    getLikesByPostId(id),
                    getAwardsByPostId(id),
                    getAllAwards(),
                ]);

                setPost(postData);
                setAuthor(authorData);
                setLikes(likesData.likes);
                setAwards(awardsData.awards);
                setAllAwardsData(allAwardsData.awards);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        loadPost();
    }, [id]);

    if (loading) {
        return <div className="post-page">Loading...</div>;
    }

    if (error || !post) {
        return (
            <div className="post-page">
                <h1>Post not found</h1>
            </div>
        );
    }

    return (
        <div className="post-page">
            <article className="post">
                <header className="post-header">
                    <h1>{post.title}</h1>

                    <div className="post-meta">
                        <span>
                            {author?.login ?? "Unknown author"}
                        </span>

                        <span>
                            {new Date(post.publishDate).toLocaleDateString()}
                        </span>
                    </div>

                    {awards.length > 0 && (
                        <div className="post-awards">
                            {awards.map((award) => {
                                const data = allAwardsData.find((a) => a.id === award.awardId);

                                return (
                                    <span
                                        className={`post-award-${data?.rarity ?? "common"}`}
                                        key={award.awardId}
                                        title={data?.description ?? "I have no idea what this award is, if you're seeing this you are very lucky"}
                                    >
                                        {data?.title ?? "Unknown award"} {award.count}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </header>

                <div className="post-content">
                    {post.content}
                </div>

                <div className="post-footer">
                    <Reactions
                        postId={id}
                        user={user}
                        likes={likes}
                        onLikesChange={setLikes}
                    />
                </div>

                <section className="post-comments">
                    <Comments postId={id} />
                </section>
            </article>
        </div>
    );
}

export default Post;