import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Root() {
  return (
    <div className="relative flex min-h-screen flex-col justify-between pt-20">
      <div>
        <nav className="fixed top-0 z-[200] w-full">
          <Navbar />
        </nav>

        <section>
          <Outlet />
        </section>
      </div>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
