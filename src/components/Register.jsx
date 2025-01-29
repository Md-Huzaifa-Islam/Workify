import axios from "axios";
import { useState } from "react";
import { BsCashCoin } from "react-icons/bs";
import { IoIosPerson } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import { RiBankCard2Fill, RiLockPasswordFill } from "react-icons/ri";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa";
import useAuth from "../Hooks/CustomHooks";

export default function Register() {
  const { SignUpEmail, update, setUser, SingInGmail } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const [error, setError] = useState("");
  const handleSignUp = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());
    formObject.created = new Date().getTime();

    // Check if the password is at least 6 characters long
    if (formObject.password.length < 6) {
      setError("Password must be at least 6 characters.");
    }

    // Check if the password contains at least one capital letter
    else if (!/[A-Z]/.test(formObject.password)) {
      setError("Password must contain at least one capital letter.");
    }

    // Check if the password contains at least one special character
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formObject.password)) {
      setError("Password must contain at least one special character.");
    } else {
      setError("");
      axios
        .post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_img_bb_key}`,
          { image: formObject.image },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        )
        .then((res) => {
          formObject.image = res.data.data.display_url;
          (formObject.verified = false),
            SignUpEmail(formObject.email, formObject.password)
              .then((userCredentials) => {
                update(formObject.name, formObject.image).then(() => {
                  setUser({ ...userCredentials.user });
                  navigate("/");
                  toast.success(`Welcome to the family ${formObject.name}`);
                  delete formObject.password;
                  axiosPublic
                    .put("adduser", formObject)
                    .then(() => {
                      //
                    })
                    .catch((err) => toast.error(err));
                });
              })
              .catch((error) => {
                toast.error(error);
              });
        })
        .catch((err) => toast.error(err));
    }
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
            toast.success(`Welcome to the family ${resUser.displayName}`);
            navigate("/");
          })
          .catch((err) => toast.error(err));
      })
      .catch((err) => toast.error(err));
  };

  return (
    <div className="mt-10">
      <div className="px-5 md:container md:mx-auto">
        <p className="pb-8 text-center text-5xl font-bold">Register</p>
        <form
          className="mx-auto grid max-w-3xl gap-x-10 gap-y-5 sm:grid-cols-2"
          onSubmit={handleSignUp}
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                <IoIosPerson />
              </div>
              <input
                type="text"
                name="name"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Your name"
                required
              />
            </div>
          </div>
          <div>
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
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                <RiLockPasswordFill />
              </div>
              <input
                type="password"
                onChange={() => setError("")}
                name="password"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="*************"
                required
              />
            </div>
            <p className="text-sm text-red-500"> {error}</p>
          </div>

          <div>
            <label
              htmlFor="countries"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Select your role
            </label>
            <select
              id="countries"
              name="role"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            >
              <option>Employee</option>
              <option>HR</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Bank Account Number
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                <RiBankCard2Fill />
              </div>
              <input
                type="number"
                name="bank"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="4242 4242 4242 42"
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Salary
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                <BsCashCoin />
              </div>
              <input
                type="number"
                name="salary"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="$$"
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Designation
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                <IoIosPerson />
              </div>
              <input
                type="text"
                name="designation"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Ex-Project manager"
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Photo
            </label>
            <div className="relative">
              <input type="file" name="image" accept="image/*" required />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block mx-auto mt-4 flex items-center rounded-full border px-5 py-2 text-xl text-white sm:col-span-2"
          >
            Register
          </button>
        </form>
        <hr className="mx-auto mt-7 max-w-3xl border-2" />
        <button
          className="mx-auto mt-4 flex items-center gap-2 rounded-full border border-blue-600 px-5 py-2 text-blue-600"
          onClick={handleGmail}
        >
          <FaGoogle />
          <p className="text-lg font-medium text-black">Signup with google</p>
        </button>
      </div>
    </div>
  );
}
