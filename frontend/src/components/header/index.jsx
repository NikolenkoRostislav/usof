import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/auth";
import Avatar from "../avatar";
import "./header.css";

function Header() {
    const { user, loading, logout } = useAuth();
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    function handleSearch(event) {
        event.preventDefault();
        const query = search.trim();
        if (!query) {
            return;
        }

        navigate(`/search?q=${encodeURIComponent(query)}`);
        setSearch("");
    }

    return (
        <>
            <header className="header">
                <div className="header-main">
                    <Link to="/" className="header-logo">
                        USOF
                    </Link>

                    <form
                        className="header-search"
                        onSubmit={handleSearch}
                    >
                        <input
                            type="search"
                            placeholder="Search..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                        <button type="submit">
                            Search
                        </button>
                    </form>

                    {!loading && (
                        <div className="header-user">
                            <Link
                                to={user ? `/profile` : "/login"}
                                className="header-avatar"
                            >
                                <Avatar user={user} />
                            </Link>

                            <div className="header-user-info">
                                <span className="header-login">
                                    {user?.login ?? "Guest"}
                                </span>

                                <span className="header-role">
                                    {user?.role ?? "Guest"}
                                </span>
                            </div>

                            {user ? (
                                <button
                                    type="button"
                                    onClick={logout}
                                    className="header-logout"
                                >
                                    Log out
                                </button>
                            ) : (
                                <Link to="/login">
                                    <button
                                        type="button"
                                        className="header-logout"
                                    >
                                        Log in
                                    </button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>

            </header>
            <nav className="header-menu">
                <Link to="/">Home</Link>
                <Link to="/gacha">Gacha</Link>

                {user && (
                    <Link to={`/profile`}>
                        Profile
                    </Link>
                )}
            </nav>
        </>
    );
}

export default Header;