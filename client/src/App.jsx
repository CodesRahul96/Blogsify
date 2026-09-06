import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Loader from "./components/layout/Loader";
import ScrollToTop from "./components/layout/ScrollToTop";
import { AuthContext } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";

// Lazy load secondary pages for code splitting
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const Support = lazy(() => import("./pages/Support"));
const Profile = lazy(() => import("./pages/Profile"));
const PrivacyPolicy = lazy(() => import("./pages/Privacy.jsx"));
const TermsOfService = lazy(() => import("./pages/TermsOfService.jsx"));
const WritingGuidelines = lazy(() => import("./pages/WritingGuidelines.jsx"));

// Dashboard router component that determines which dashboard to show
function DashboardRouter() {
  const { user } = useContext(AuthContext) || {};
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) return <Loader />;

  // Render AdminDashboard if user is admin, otherwise UserDashboard
  return user.isAdmin ? <AdminDashboard /> : <UserDashboard />;
}

// Protected route specifically for Admin
function AdminRoute() {
  const { user } = useContext(AuthContext) || {};
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!user) return <Loader />;
  if (!user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return <AdminDashboard />;
}

function App() {
  // Sync toast theme with the app's resolved dark/light mode
  const { resolvedTheme } = useTheme();
  const toastTheme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="animate-fade-in">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/about" element={<About />} />
            <Route exact path="/contact" element={<Contact />} />
            <Route exact path="/blogs" element={<Blogs />} />
            <Route exact path="/blog/:id" element={<BlogDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/signup" element={<Navigate to="/register" replace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/admin" element={<AdminRoute />} />
            <Route path="/support" element={<Support />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/guidelines" element={<WritingGuidelines />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />

      {/* Single globally-configured ToastContainer — no per-call options needed */}
      <ToastContainer
        position="bottom-right"
        theme={toastTheme}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        limit={4}
      />
    </>
  );
}

export default App;
