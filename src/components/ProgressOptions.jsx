import PropTypes from "prop-types";
import { RiResetLeftLine } from "react-icons/ri";

export default function ProgressOptions({
  setName,
  setMonth,
  name,
  month,
  uniqueNames,
}) {
  // const uniqueNames = [...new Set(data.map((item) => item.name))];
  return (
    <div className="flex flex-wrap items-center justify-center gap-5 px-5 sm:px-0">
      <select
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      >
        <option value="" disabled>
          Select a name
        </option>
        {uniqueNames.map((n, index) => (
          <option key={index} value={n}>
            {n}
          </option>
        ))}
      </select>
      <select
        value={month}
        onChange={(e) => {
          setMonth(e.target.value);
        }}
      >
        <option value="" disabled>
          Select a Month
        </option>
        <option value="January">January</option>
        <option value="February">February</option>
        <option value="March">March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="June">June</option>
        <option value="July">July</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="December">December</option>
      </select>
      <button
        className="btn btn-primary flex items-center justify-center gap-1"
        onClick={() => {
          setMonth("");
          setName("");
        }}
      >
        <p>Reset</p> <RiResetLeftLine />
      </button>
    </div>
  );
}

ProgressOptions.propTypes = {
  setName: PropTypes.func.isRequired,
  setMonth: PropTypes.func.isRequired,
  month: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  uniqueNames: PropTypes.array.isRequired,
};
