import slider1 from "/image/slider1.jpg";
import slider2 from "/image/slider2.jpg";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";

import { Autoplay, EffectFade } from "swiper/modules";
export default function BannerSlider() {
  return (
    <div>
      <Swiper
        spaceBetween={30}
        effect={"fade"}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, EffectFade]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img
            className="h-full w-full rounded-xl object-cover object-center"
            src={slider1}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            className="h-full w-full rounded-xl object-cover object-center"
            src={slider2}
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
