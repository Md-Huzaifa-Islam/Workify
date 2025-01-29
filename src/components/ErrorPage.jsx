import { Helmet } from "react-helmet-async";
import { FaHome } from "react-icons/fa";
import { IoMdSkipBackward } from "react-icons/io";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Helmet>
        <title>ErrorPage || Workify</title>
      </Helmet>
      <div className="mx-5 flex w-full max-w-sm flex-col items-center justify-center gap-5 rounded-xl border-2 px-5 py-10 text-center shadow-2xl sm:max-w-lg sm:py-20">
        <p className="text-4xl font-bold sm:text-6xl">404</p>{" "}
        <p className="text-lg font-semibold uppercase sm:text-xl">
          {" "}
          sorry the page couldn&apos;t found
        </p>
        <div className="grid grid-cols-2 gap-5">
          <Link to={-1} className="btn btn-secondary">
            <IoMdSkipBackward />
            <p className="">Go back</p>
          </Link>
          <Link to={"/"} className="btn btn-primary">
            <p>Go Home</p>
            <FaHome />
          </Link>
        </div>
      </div>
    </div>
  );
}
