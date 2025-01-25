import PropTypes from "prop-types";

export default function FaqsCard({ faqs }) {
  console.log(faqs);
  return (
    <div className="grid gap-3">
      {faqs.map((faq, index) => (
        <div
          tabIndex={0}
          key={index}
          className="collapse-arrow border-base-300 bg-base-200 collapse border"
        >
          <div className="collapse-title text-xl font-medium">
            {faq?.question || "This question will be answered soon"}
          </div>
          <div className="collapse-content">
            <p>{faq?.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

FaqsCard.propTypes = {
  faqs: PropTypes.array,
};
