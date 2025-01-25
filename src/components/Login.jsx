import { FaGoogle } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import LoginAnimation from "./LoginAnimation";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../Hooks/CustomHooks";

export default function Login() {
  const { SingInGmail, SignInEmail } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  // handle login
  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());
    SignInEmail(formObject.email, formObject.password)
      .then((user) => {
        toast.success(`Welcome Back ${user.user?.displayName}`);
        // Signed in
        navigate("/");
        // ...
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // handle gmail login
  const handleGmail = (e) => {
    e.preventDefault();
    SingInGmail()
      .then((res) => {
        const resUser = res.user;
        const payload = {
          name: resUser.displayName,
          email: resUser.email,
          role: "Employee",
          verified: false,
          created: new Date().getTime(),
        };

        axiosPublic
          .put("adduser", payload)
          .then(() => {
            toast.success(`Welcome back ${resUser.displayName}`);
            navigate("/");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="grid items-center justify-items-center px-5 md:container sm:grid-cols-2 md:mx-auto">
      <div className="hidden w-full max-w-xl sm:block">
        <LoginAnimation />
      </div>
      <div className="mx-auto max-w-md rounded-lg border-2 p-10 md:min-w-[350px] md:p-8 lg:min-w-[400px] lg:p-10">
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
            className="btn btn-primary btn-block mx-auto mt-4 flex items-center rounded-full border px-5 py-2 text-xl text-white"
          >
            Login
          </button>
        </form>
        <hr className="mt-7 border-2" />
        <button
          className="mx-auto mt-4 flex items-center gap-2 rounded-full border border-blue-600 px-5 py-2 text-blue-600"
          onClick={handleGmail}
        >
          <FaGoogle />
          <p className="text-lg font-medium text-black">Login with google</p>
        </button>
      </div>
    </div>
  );
}
