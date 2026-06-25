// import { Routes, Route } from "react-router-dom";
// import MainLayout from "./layouts/main-layout";

// import Home from "./pages/home-page";
// import Dashboard from "./pages/dashboard-page";
// import Login from "./pages/login-page";
// import Mood from "./pages/mood-page";
// import Pain from "./pages/pain-page";
// import Event from "./pages/event-page";
// import Graphs from "./pages/graph-report-page";

// function App() {
//   return (
//     <Routes>
//       <Route element={<MainLayout />}>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/mood" element={<Mood />} />
//         <Route path="/pain" element={<Pain />} />
//         <Route path="/event" element={<Event />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/graphs" element={<Graphs />} />
//       </Route>
//     </Routes>
//   );
// }

// export default App;

import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/main-layout";
import AuthLayout from "./layouts/auth-layout";

import Home from "./pages/home-page";
import Login from "./pages/login-page";
import Mood from "./pages/mood-page";
import Pain from "./pages/pain-page";
import Event from "./pages/event-page";
import Graphs from "./pages/graph-report-page";

function App() {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Main Application Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/pain" element={<Pain />} />
        <Route path="/event" element={<Event />} />
        <Route path="/graphs" element={<Graphs />} />
      </Route>
    </Routes>
  );
}

export default App;
