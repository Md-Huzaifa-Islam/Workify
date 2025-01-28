import { Link } from "react-router-dom";
import icon from "../../public/image/icon.png";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="">
      <div className="w-full">
        <div className="px-5 md:container md:mx-auto">
          <div className="flex items-center justify-between">
            <div>
              {" "}
              <Link
                to={"/"}
                className="flex items-center space-x-2 rtl:space-x-reverse"
              >
                <img src={icon} className="h-8" alt="Flowbite Logo" />
                <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                  Workify
                </span>
              </Link>
            </div>
            <ul className="flex items-center justify-center gap-5 text-3xl">
              <li className="">
                <Link
                  href={"https://www.linkedin.com/in/huzaifaislam/"}
                  target="_blank"
                >
                  <FaLinkedin />
                </Link>
              </li>
              <li className="">
                <Link
                  href={"https://github.com/Md-Huzaifa-Islam"}
                  target="_blank"
                >
                  <FaGithub />
                </Link>
              </li>
              <li className="">
                <Link
                  href={"https://www.facebook.com/Huzaifaislamrokib"}
                  target="_blank"
                >
                  <FaFacebook />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-8" />
        <div className="pb-8 text-center">
          <span className="text-sm">
            © 2023{" "}
            <a href="https://flowbite.com/" className="hover:underline">
              Flowbite™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
