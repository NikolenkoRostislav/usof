import { Routes, Route } from "react-router";
import Home from "./pages/home";
import Login from "./pages/login";
import Registration from "./pages/registration";
import Profile from "./pages/profile";
import NotFound from "./pages/not-found";

import Header from "./components/header";
import Footer from "./components/footer";


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
