import PropTypes from "prop-types";

export default function FaqsCard({ faqs }) {
  return (
    <div className="grid max-w-xl gap-3 justify-self-end">
      {faqs.map((faq, index) => (
        <div
          tabIndex={0}
          key={index}
          className="collapse collapse-arrow border bg-slate-200"
        >
          <div className="collapse-title text-lg font-medium sm:text-base md:text-lg lg:text-xl">
            {faq?.question || "This question will be answered soon"}
          </div>
          <div className="collapse-content text-sm lg:text-base">
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
