
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/main-layout";
import AuthLayout from "./layouts/auth-layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy-loaded page components
const Home = lazy(() => import("./pages/home-page"));
const Login = lazy(() => import("./pages/login-page"));
const Mood = lazy(() => import("./pages/mood-page"));
const Pain = lazy(() => import("./pages/pain-page"));
const Event = lazy(() => import("./pages/event-page"));
const Graphs = lazy(() => import("./pages/graph-report-page"));

function App() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Routes>
        {/* Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Main Application Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/mood" element={<Mood />} />
            <Route path="/pain" element={<Pain />} />
            <Route path="/event" element={<Event />} />
            <Route path="/graphs" element={<Graphs />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
