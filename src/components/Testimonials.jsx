import { Swiper, SwiperSlide } from "swiper/react";
import ReactStars from "react-rating-stars-component";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-flip";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, EffectFlip } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading";
import useAxiosPublic from "../Hooks/useAxiosPublic";
export default function Testimonials() {
  const axiosSecure = useAxiosPublic();

  const getReviews = async () => {
    const { data } = await axiosSecure.get("reviews");
    return data;
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
  });
  if (isLoading) return <Loading />;
  if (error)
    return (
      <div>
        <p>Error: {error.message}</p>
        <button>refresh</button>
      </div>
    );

  return (
    <div>
      <Swiper
        effect={"flip"}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        grabCursor={true}
        modules={[Autoplay, EffectFlip]}
        className="mySwiper w-96"
      >
        {data &&
          data.map((review) => (
            <SwiperSlide key={review._id} className="border">
              <div className="bg-cardBg rounded-xl p-8 py-10 transition-all duration-300 ease-in-out hover:scale-105">
                <div className="mx-auto grid gap-4 text-center">
                  <div className="mx-auto size-32 rounded-full">
                    <img
                      src={review?.photo}
                      className="h-full w-full rounded-full object-cover object-center"
                      alt=""
                    />
                  </div>
                  <p className="text-xl font-medium">{review?.name}</p>
                </div>
                <p className="mt-6 break-words text-center text-base italic opacity-80">
                  {review?.review}
                </p>

                {/* rating  */}
                <div className="mx-auto mt-8 w-max">
                  <ReactStars
                    isHalf={true}
                    value={review?.rating}
                    size={30}
                    edit={false}
                  ></ReactStars>
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
