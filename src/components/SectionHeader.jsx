import PropTypes from "prop-types";

export default function SectionHeader({ heading, subHeading }) {
  return (
    <div className="mx-auto grid max-w-lg gap-4 px-5 pb-8 text-center sm:max-w-xl sm:gap-2 sm:pb-4 md:max-w-2xl md:gap-3 md:pb-6 lg:max-w-4xl lg:gap-4 lg:pb-10">
      <p className="text-3xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl">
        {heading}
      </p>
      <p className="text-lg sm:text-base md:text-lg lg:text-xl">{subHeading}</p>
    </div>
  );
}

SectionHeader.propTypes = {
  heading: PropTypes.string.isRequired,
  subHeading: PropTypes.string.isRequired,
};
