import AddFaqSection from "./AddFaqSection";
import FaqsCard from "./FaqsCard";
import SectionHeader from "./SectionHeader";

export default function FaqsContainer() {
  const faqs = [
    {
      _id: 1,
      question: "What is this platform used for?",
      answer:
        "This platform is designed to manage employee tasks, payment history, and streamline HR and admin operations.",
    },
    {
      _id: 2,
      question: "Is my data secure on this platform?",
      answer:
        "Absolutely! We use advanced encryption and are compliant with industry security standards to keep your data safe.",
    },
  ];
  return (
    <div>
      <SectionHeader
        heading="Frequently Asked Questions "
        subHeading="Explore commonly asked questions or share your own. We're here to provide clarity and help with anything you need."
      />
      <div className="grid grid-cols-2 items-start gap-5">
        <FaqsCard faqs={faqs} />
        <AddFaqSection />
      </div>
    </div>
  );
}
