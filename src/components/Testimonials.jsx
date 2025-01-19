import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import { Autoplay, EffectCube, Pagination } from "swiper/modules";
export default function Testimonials() {
  return (
    <div className="mx-auto max-w-xl">
      <Swiper
        effect={"cube"}
        grabCursor={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        }}
        pagination={true}
        modules={[Autoplay, EffectCube, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center">
              {/* User Avatar */}
              <img
                className="h-12 w-12 rounded-full shadow-md"
                src="https://via.placeholder.com/150"
                alt="User Avatar"
              />
              <div className="ml-4">
                {/* User Name */}
                <h5 className="text-lg font-semibold">John Doe</h5>
                {/* User Role */}
                <p className="text-sm text-gray-500">Software Engineer</p>
              </div>
            </div>
            {/* Testimonial Content */}
            <p className="text-gray-700">
              "This product has completely transformed the way I work. The
              quality and ease of use are unmatched. Highly recommended for
              anyone looking for seamless integration and functionality!"
            </p>
            {/* Rating */}
            <div className="mt-4 flex">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className="h-5 w-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15.27L16.18 18l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 3.73L3.82 18z" />
                </svg>
              ))}
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center">
              {/* User Avatar */}
              <img
                className="h-12 w-12 rounded-full shadow-md"
                src="https://via.placeholder.com/150"
                alt="User Avatar"
              />
              <div className="ml-4">
                {/* User Name */}
                <h5 className="text-lg font-semibold">John Doe</h5>
                {/* User Role */}
                <p className="text-sm text-gray-500">Software Engineer</p>
              </div>
            </div>
            {/* Testimonial Content */}
            <p className="text-gray-700">
              "This product has completely transformed the way I work. The
              quality and ease of use are unmatched. Highly recommended for
              anyone looking for seamless integration and functionality!"
            </p>
            {/* Rating */}
            <div className="mt-4 flex">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className="h-5 w-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15.27L16.18 18l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 3.73L3.82 18z" />
                </svg>
              ))}
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
