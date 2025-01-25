import Testimonials from "./Testimonials";

import AddTestimonial from "./AddTestimonial";
import SectionHeader from "./SectionHeader";

export default function TestimonialContainer() {
  return (
    <div>
      <SectionHeader
        heading="What Our Users Are Saying"
        subHeading="Read inspiring stories from our valued users and share your own experience with us. Your feedback helps us grow and serve you better"
      />
      <div className="flex items-center justify-center gap-10">
        <Testimonials />
        <AddTestimonial />
      </div>
    </div>
  );
}
