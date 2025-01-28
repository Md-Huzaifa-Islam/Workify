import AddFaqSection from "./AddFaqSection";
import FaqsCard from "./FaqsCard";
import SectionHeader from "./SectionHeader";

export default function FaqsContainer() {
  const faqs = [
    {
      _id: 1,
      question: "What is the primary purpose of this platform?",
      answer:
        "This platform is designed to simplify employee task management, streamline payment approvals, and improve HR and admin operations, ensuring a more efficient workflow for businesses.",
    },
    {
      _id: 2,
      question: "Is my company’s data secure on this platform?",
      answer:
        "Absolutely! We use advanced encryption and adhere to industry standards to ensure that all your data is stored securely and remains confidential.",
    },
    {
      _id: 3,
      question: "Can I track payment history for all employees?",
      answer:
        "Yes, our platform allows you to track detailed payment records for each employee, making it easier to manage payroll and maintain transparency.",
    },
    {
      _id: 4,
      question: "How do I assign tasks to employees?",
      answer:
        "You can easily assign tasks through the dashboard. Simply select an employee, set a deadline, and add task details. Notifications will be sent to the assigned employee automatically.",
    },
    {
      _id: 5,
      question: "Is this platform suitable for small businesses?",
      answer:
        "Yes, our platform is scalable and designed to cater to businesses of all sizes, from startups to large enterprises.",
    },
    {
      _id: 6,
      question: "Can I customize the platform for my company’s needs?",
      answer:
        "Certain features of the platform are customizable to better suit your business requirements. Contact our support team for more details.",
    },
  ];

  return (
    <div className="px-5 md:container md:mx-auto">
      <SectionHeader
        heading="Frequently Asked Questions "
        subHeading="Explore commonly asked questions or share your own. We're here to provide clarity and help with anything you need."
      />
      <div className="grid items-start gap-14 sm:grid-cols-2 sm:gap-7 md:gap-14">
        <FaqsCard faqs={faqs} />
        <AddFaqSection />
      </div>
    </div>
  );
}
