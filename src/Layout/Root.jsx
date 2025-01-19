import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Root() {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <div>
        <nav>
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
