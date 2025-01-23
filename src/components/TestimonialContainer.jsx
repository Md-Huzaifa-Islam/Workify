import Testimonials from "./Testimonials";

import AddTestimonial from "./AddTestimonial";

export default function TestimonialContainer() {
  return (
    <div className="flex items-center justify-center gap-10">
      <Testimonials />
      <AddTestimonial />
    </div>
  );
}
