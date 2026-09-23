import InfiniteScroll from "../../components/infinite-scroll";
import "./home.css";

function Home() {
    return (
        <div className="home-page">
            <h1>Posts</h1>

            <InfiniteScroll />
        </div>
    );
}

export default Home;