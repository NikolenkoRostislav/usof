import { useAuth } from "../../context/auth";

function Header() {
    const { user, loading } = useAuth();

    return (
        <header>
            <h1>USOF</h1>

            {!loading && user && (
                <div>
                    <span>{user.login}</span>
                    <span>{user.role}</span>
                </div>
            )}
            {!user && (
                <div>
                    <span>Guest</span>
                </div>
            )}
        </header>
    );
}

export default Header;