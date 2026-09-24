import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../../context/auth";
import InfiniteScroll from "../../components/infinite-scroll";
import PostFilters from "./post-filters";
import "./home.css";

function Home() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    const [filters, setFilters] = useState({});
    const [search, setSearch] = useState("");

    function handleFilterChange(event) {
        const { name, value } = event.target;

        setFilters(prev => ({
            ...prev,
            [name]: value || undefined,
        }));
    }

    function handleSearch(event) {
        event.preventDefault();

        setFilters(prev => ({
            ...prev,
            title: search || undefined,
        }));
    }

    return (
        <div className="home-page">
            <h1>Posts</h1>

            <div className="home-sidebar">
                <button
                    className="create-post-button"
                    onClick={() => navigate("/create-post")}
                    disabled={loading || !user}
                    title={!user ? "You must be logged in to create a post." : ""}
                >
                    Create Post
                </button>

                <PostFilters
                    filters={filters}
                    search={search}
                    onFilterChange={handleFilterChange}
                    onSearchChange={event => setSearch(event.target.value)}
                    onSearch={handleSearch}
                />
            </div>

            <InfiniteScroll filters={filters} />
        </div>
    );
}

export default Home;