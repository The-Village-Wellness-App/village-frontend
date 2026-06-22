import { Outlet } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function AuthLayout() {
  return (
    <>
      <Header />
      <main>
        <AuthNavbar />
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
