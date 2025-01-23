import axios from "axios";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useAuth } from "../Hooks/CustomHooks";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { useState } from "react";

export default function Register() {
  const { SignUpEmail, update, setUser } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [error, setError] = useState("");
  const handleSignUp = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());
    formObject.created = new Date().getTime();
    console.log(formObject);
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
                  delete formObject.password;
                  axiosPublic
                    .put("adduser", formObject)
                    .then((res) => console.log(res.data))
                    .catch((err) => console.log(err));
                });
              })
              .catch((error) => {
                console.log(error);
              });
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div>
      <p>Login</p>
      <div>
        <form className="mx-auto max-w-md" onSubmit={handleSignUp}>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
              <RiLockPasswordFill />
            </div>
            <input
              type="text"
              name="name"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="name@flowbite.com"
              required
            />
          </div>
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

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                <RiLockPasswordFill />
              </div>
              <input
                type="text"
                onChange={() => setError("")}
                name="password"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="name@flowbite.com"
                required
              />
            </div>
            <p className="text-sm text-red-500"> {error}</p>
          </div>

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
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Bank Account Number
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
              <RiLockPasswordFill />
            </div>
            <input
              type="number"
              name="bank"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="name@flowbite.com"
              required
            />
          </div>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Salary
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
              <RiLockPasswordFill />
            </div>
            <input
              type="number"
              name="salary"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="name@flowbite.com"
              required
            />
          </div>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Designation
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
              <RiLockPasswordFill />
            </div>
            <input
              type="text"
              name="designation"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="name@flowbite.com"
              required
            />
          </div>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Photo
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
              <RiLockPasswordFill />
            </div>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="name@flowbite.com"
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
      </div>
    </div>
  );
}
