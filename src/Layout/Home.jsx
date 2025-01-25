import Banner from "../components/Banner";
import ContactContainer from "../components/ContactContainer";
import FaqsContainer from "../components/FaqsContainer";
import ServicesContainer from "../components/ServicesContainer";
import TestimonialContainer from "../components/TestimonialContainer";

export default function Home() {
  return (
    <div className="grid gap-24 pb-24">
      <Banner />
      <ServicesContainer />
      <TestimonialContainer />
      <ContactContainer />
      <FaqsContainer />
    </div>
  );
}
