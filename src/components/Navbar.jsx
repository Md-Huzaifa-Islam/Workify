import { Avatar, Dropdown } from "flowbite-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import icon from "../../public/image/icon.png";
import useAuth from "../Hooks/CustomHooks";
import { toast } from "react-toastify";

export default function Navbar() {
  const { user, signout } = useAuth();
  const location = useLocation().pathname;
  const handleLogout = () => {
    signout()
      .then(() => {
        toast.success("Good Bye");
      })
      .catch((err) => toast.error(err));
  };
  const links = (
    <>
      <li>
        <NavLink
          to={"/"}
          className={`block rounded px-3 py-2 md:bg-transparent md:p-0 ${location == "/" && "text-blue-700"}`}
          aria-current="page"
        >
          Home
        </NavLink>
      </li>

      <li>
        <NavLink
          to={"/contact"}
          className={`block rounded px-3 py-2 md:bg-transparent md:p-0 ${location == "/contact" && "text-blue-700"}`}
        >
          Contact Us
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink
            to={"/dashboard"}
            className={`block rounded px-3 py-2 md:bg-transparent md:p-0 ${location.slice(0, 10) == "/dashboard" && "text-blue-700"}`}
          >
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <nav className="z-20 w-full border-b border-gray-200 bg-white px-5 dark:border-gray-600 dark:bg-gray-900">
      <div className="mx-auto flex flex-wrap items-center justify-between py-4 md:container md:mx-auto">
        {/* Logo */}
        <Link
          to={"/"}
          className="flex items-center space-x-2 rtl:space-x-reverse"
        >
          <img src={icon} className="h-8" alt="Flowbite Logo" />
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            Workify
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex space-x-3 md:order-2 rtl:space-x-reverse">
          {/* Dropdown Avatar */}
          {user && (
            <Dropdown
              arrowIcon={false}
              inline
              label={<Avatar alt="User avatar" img={user?.photoURL} rounded />}
              className="" // Ensure alignment starts at the button's left
            >
              <Dropdown.Item>
                <button
                  onClick={handleLogout}
                  type="button"
                  className="mr-3 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  log out
                </button>
              </Dropdown.Item>
            </Dropdown>
          )}

          {/* Login & Signup Buttons */}
          {!user && (
            <>
              <Link
                to={"/login"}
                type="button"
                className="mr-3 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Login
              </Link>
              <Link
                to={"/register"}
                type="button"
                className="rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                SignUp
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        {/* Navbar Links */}
        <div
          className="hidden w-full items-center justify-between md:order-1 md:flex md:w-auto"
          id="navbar-sticky"
        >
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 md:dark:bg-gray-900 rtl:space-x-reverse">
            {links}
          </ul>
        </div>
      </div>
    </nav>
  );
}
