import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import { Autoplay, EffectCube, Pagination } from "swiper/modules";
import Loading from "./Loading";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";
export default function Testimonials() {
  const axiosSecure = useAxiosPublic();
  const getReviews = async () => {
    const { data } = await axiosSecure.get("reviews");
    return data;
  };
  const { isLoading, isError, data } = useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
  });
  if (isLoading) return <Loading />;
  if (isError) return <p>Error loading data!</p>;
  return (
    data && (
      <div className="max-w-md rounded-lg">
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
          {data &&
            data.map((review) => (
              <SwiperSlide key={review._id}>
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
                  <div className="mb-4 flex items-center">
                    {/* User Avatar */}
                    <img
                      className="h-12 w-12 rounded-full shadow-md"
                      src={review?.photo}
                      alt="User Avatar"
                    />
                    <div className="ml-4">
                      {/* User Name */}
                      <h5 className="text-lg font-semibold">{review?.name}</h5>
                      {/* User Role */}
                    </div>
                  </div>
                  {/* Testimonial Content */}
                  <p className="text-gray-700">{review?.review}</p>
                  {/* Rating */}
                  <div className="mt-4 flex">
                    {[...Array(review?.rating)].map((_, index) => (
                      <svg
                        key={index}
                        className="h-5 w-5 text-yellow-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15.27L16.18 18l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 3.73L3.82 18z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    )
  );
}
