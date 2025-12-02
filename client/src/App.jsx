import { Routes, Route } from "react-router-dom";
import { Suspense, lazy, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import { AuthContext } from "./context/AuthContext";

// Lazy load pages for faster initial bundle
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const Blogs = lazy(() => import("./pages/Blogs"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const Support = lazy(() => import("./pages/Support"));
const Profile = lazy(() => import("./pages/Profile"));

// Dashboard router component that determines which dashboard to show
function DashboardRouter() {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return null;
  }

  if (!user) return null;

  // Render AdminDashboard if user is admin, otherwise UserDashboard
  return user.isAdmin ? <AdminDashboard /> : <UserDashboard />;
}

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/about" element={<About />} />
            <Route exact path="/contact" element={<Contact />} />
            <Route exact path="/blogs" element={<Blogs />} />
            <Route exact path="/blog/:id" element={<BlogDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/support" element={<Support />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;
