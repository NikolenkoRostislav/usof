import { useState } from "react";
import InfiniteScroll from "../../components/infinite-scroll";
import PostFilters from "./post-filters";
import "./home.css";

function Home() {
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

            <PostFilters
                filters={filters}
                search={search}
                onFilterChange={handleFilterChange}
                onSearchChange={event => setSearch(event.target.value)}
                onSearch={handleSearch}
            />

            <InfiniteScroll filters={filters} />
        </div>
    );
}

export default Home;