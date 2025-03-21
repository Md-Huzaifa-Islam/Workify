import { Helmet } from "react-helmet-async";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import SectionHeader from "./SectionHeader";

export default function Contact() {
  return (
    <div className="pt-8 lg:pt-14">
      <Helmet>
        <title>Contact Us || Workify</title>
      </Helmet>
      <SectionHeader
        heading="Get in Touch with Us"
        subHeading="Have questions, feedback, or need assistance? Send us a message, and our team will get back to you promptly."
      />
      <div className="mx-auto flex w-max flex-col items-start justify-center gap-8 sm:gap-8 md:gap-12 lg:flex-row lg:gap-20">
        <ContactForm />
        <div className="divider lg:divider-horizontal">OR</div>
        <ContactInfo />
      </div>
    </div>
  );
}
