import { FaGoogle } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useAuth } from "../Hooks/CustomHooks";

export default function Login() {
  const { SingInGmail } = useAuth();
  // handle login
  const handleLogin = (e) => {
    e.preventDefault();
    const name = e.target.email.value.trim();
    const password = e.target.password.value.trim();
  };

  // handle gmail login
  const handleGmail = (e) => {
    e.preventDefault();
    SingInGmail()
      .then((res) => console.log(res.user))
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <p>Login</p>
      <div className="mx-auto max-w-md">
        <form className="mx-auto" onSubmit={handleLogin}>
          <label
            htmlFor="email-address-icon"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Your Email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
              <MdOutlineMail />
            </div>
            <input
              type="email"
              name="email"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="name@flowbite.com"
              required
            />
          </div>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
              <RiLockPasswordFill />
            </div>
            <input
              type="password"
              name="password"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          >
            Submit
          </button>
        </form>

        <button
          className="mx-auto flex items-center rounded-full border px-5 py-2"
          onClick={handleGmail}
        >
          <FaGoogle />
          <p>Login with google</p>
        </button>
      </div>
    </div>
  );
}
