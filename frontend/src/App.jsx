import { Routes, Route } from "react-router";
import Home from "./pages/home";
import Login from "./pages/login";
import Categories from "./pages/categories";
import CategoryPosts from "./pages/category-posts";
import Registration from "./pages/registration";
import ConfirmRegistration from "./pages/confirm-registration";
import Profile from "./pages/profile";
import ResetPassword from "./pages/reset-password";
import RequestPasswordReset from "./pages/request-password-reset";
import NotFound from "./pages/not-found";
import Post from "./pages/post";
import EditPost from "./pages/edit-post";
import CreatePost from "./pages/create-post";
import "./App.css";
import Header from "./components/header";
import Footer from "./components/footer";


function App() {
  return (
    <div className="app">
      <Header />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search/:search" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/posts/edit/:id" element={<EditPost />} />
          <Route path="/posts/category/:id" element={<CategoryPosts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/confirm-registration/:token/:email" element={<ConfirmRegistration />} />
          <Route path="/request-password-reset" element={<RequestPasswordReset />} />
          <Route path="/reset-password/:token/:email" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/create-post" element={<CreatePost />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
