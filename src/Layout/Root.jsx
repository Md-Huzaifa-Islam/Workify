import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Root() {
  return (
    <div>
      <nav>
        <Navbar />
      </nav>

      <section>
        <Outlet />
      </section>
    </div>
  );
}
