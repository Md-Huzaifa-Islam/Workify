import PropTypes from "prop-types";

export default function SectionHeader({ heading, subHeading }) {
  return (
    <div className="mx-auto grid max-w-4xl gap-4 pb-10 text-center">
      <p className="text-5xl font-semibold">{heading}</p>
      <p className="text-xl">{subHeading}</p>
    </div>
  );
}

SectionHeader.propTypes = {
  heading: PropTypes.string.isRequired,
  subHeading: PropTypes.string.isRequired,
};
