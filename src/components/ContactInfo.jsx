import { MdEmail } from "react-icons/md";
import { FaFacebook, FaGithub, FaLinkedin, FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
export default function ContactInfo() {
  return (
    <div className="shadow-btnColor-0 mx-auto rounded-lg border-2 border-white p-10 pb-20 shadow-lg lg:mx-0">
      {/* contact info  */}
      <div>
        {/* head  */}
        <p className="pb-14 text-center text-2xl font-medium">Contact Info</p>
        <ul className="flex flex-col gap-5">
          <li>
            <Link
              className="text-btnColor-0 hover:text-huzaifa-0 flex items-center gap-3"
              href={`mailto:huzaifaislamrakib@gmail.com`}
            >
              <MdEmail size={25} />

              <p>HuzaifaIslamRakib@gmail.com</p>
            </Link>
          </li>
          <li>
            <Link
              className="text-btnColor-0 hover:text-huzaifa-0 flex items-center gap-3"
              href={`tel:+8801915131099`}
            >
              <FaPhoneAlt size={25} />
              <p>+8801915131099 </p>
            </Link>
          </li>
          <li>
            <Link
              className="text-btnColor-0 hover:text-huzaifa-0 flex items-center gap-3"
              href="https://maps.app.goo.gl/Uem61dQwP9PmfdYs8"
              target="_blank"
            >
              <FaLocationDot size={25} />
              <p>Chittagong, Bangladesh</p>
            </Link>
          </li>
        </ul>
      </div>

      {/* social info  */}
      <div>
        {/* head  */}
        <p className="mt-20 pb-6 text-center text-2xl font-medium">
          Social Links
        </p>
        <ul className="flex items-center justify-center gap-5 text-3xl">
          <li className="text-btnColor-0 hover:text-huzaifa-0">
            <Link
              href={"https://www.linkedin.com/in/huzaifaislam/"}
              target="_blank"
            >
              <FaLinkedin />
            </Link>
          </li>
          <li className="text-btnColor-0 hover:text-huzaifa-0">
            <Link href={"https://github.com/Md-Huzaifa-Islam"} target="_blank">
              <FaGithub />
            </Link>
          </li>
          <li className="text-btnColor-0 hover:text-huzaifa-0">
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
  );
}
