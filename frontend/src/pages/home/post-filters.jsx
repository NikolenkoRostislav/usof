import "./post-filters.css";

function PostFilters({
    filters,
    search,
    onFilterChange,
    onSearchChange,
    onSearch,
}) {
    return (
        <section className="post-filters">
            <div className="post-filter">
                <form onSubmit={onSearch}>
                    <label htmlFor="title">Search</label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Search posts..."
                        value={search}
                        onChange={onSearchChange}
                    />
                    <button type="submit">
                        Search
                    </button>
                </form>
            </div>

            <div className="post-filter">
                <label htmlFor="sortBy">Sort by</label>
                <select
                    id="sortBy"
                    name="sortBy"
                    value={filters.sortBy || ""}
                    onChange={onFilterChange}
                >
                    <option value="date">Last Added</option>
                    <option value="">Likes</option>
                </select>
            </div>

            <div className="post-filter">
                <label htmlFor="fromDate">From</label>
                <input
                    id="fromDate"
                    name="fromDate"
                    type="date"
                    value={filters.fromDate || ""}
                    onChange={onFilterChange}
                />
            </div>

            <div className="post-filter">
                <label htmlFor="toDate">To</label>
                <input
                    id="toDate"
                    name="toDate"
                    type="date"
                    value={filters.toDate || ""}
                    onChange={onFilterChange}
                />
            </div>
        </section>
    );
}

export default PostFilters;