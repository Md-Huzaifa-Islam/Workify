import PropTypes from "prop-types";
export default function SingleHeader({ heading }) {
  return (
    <div className="mx-auto grid w-max max-w-lg border-b-2 border-blue-600 px-5 pb-2 text-center sm:max-w-xl sm:pb-1 md:max-w-2xl md:pb-2 lg:max-w-4xl lg:pb-3">
      <p className="text-3xl font-semibold sm:text-3xl md:text-3xl lg:text-4xl">
        {heading}
      </p>
    </div>
  );
}
SingleHeader.propTypes = {
  heading: PropTypes.string.isRequired,
};
