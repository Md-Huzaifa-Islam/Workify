import { Avatar, Dropdown } from "flowbite-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../Hooks/CustomHooks";

export default function Navbar() {
  const { user, signout } = useAuth();
  const handleLogout = () => {
    signout()
      .then(() => console.log("logged out"))
      .catch((err) => console.log(err));
  };
  const links = (
    <>
      <li>
        <a
          href="#"
          className="block rounded bg-blue-700 px-3 py-2 text-white md:bg-transparent md:p-0 md:text-blue-700 md:dark:text-blue-500"
          aria-current="page"
        >
          Home
        </a>
      </li>

      <li>
        <a
          href="#"
          className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
        >
          Contact Us
        </a>
      </li>
      {user && (
        <li>
          <NavLink
            to={"/dashboard"}
            className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
          >
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-20 w-full border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        {/* Logo */}
        <a
          href="https://flowbite.com/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            Flowbite
          </span>
        </a>

        {/* Right Section */}
        <div className="flex space-x-3 md:order-2 rtl:space-x-reverse">
          {/* Dropdown Avatar */}
          {user && (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="User avatar"
                  img="https://via.placeholder.com/150"
                  rounded
                />
              }
              className="" // Ensure alignment starts at the button's left
            >
              <Dropdown.Header>
                <span className="block text-sm">John Doe</span>
                <span className="block truncate text-sm font-medium">
                  johndoe@example.com
                </span>
              </Dropdown.Header>
              <Dropdown.Item>
                <a href="/profile">Profile</a>
              </Dropdown.Item>
              <Dropdown.Item>
                <a href="/settings">Settings</a>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => console.log("Logout clicked")}>
                Logout
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
          {!user || (
            <>
              <button
                onClick={handleLogout}
                type="button"
                className="mr-3 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                log out
              </button>
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
