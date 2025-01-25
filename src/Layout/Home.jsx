import Banner from "../components/Banner";
import ContactContainer from "../components/ContactContainer";
import FaqsContainer from "../components/FaqsContainer";
import ServicesContainer from "../components/ServicesContainer";
import TestimonialContainer from "../components/TestimonialContainer";

export default function Home() {
  return (
    <div className="grid gap-16 pb-16 sm:gap-10 sm:pb-10 md:gap-16 md:pb-16 lg:gap-24 lg:pb-24">
      <Banner />
      <ServicesContainer />
      <TestimonialContainer />
      <FaqsContainer />
      <ContactContainer />
    </div>
  );
}
