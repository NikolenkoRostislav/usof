import { Routes, Route } from "react-router";
import Home from "./pages/home";
import Login from "./pages/login";
import Registration from "./pages/registration";
import Profile from "./pages/profile";
import NotFound from "./pages/not-found";
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
