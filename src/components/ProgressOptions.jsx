import PropTypes from "prop-types";
import { RiResetLeftLine } from "react-icons/ri";

export default function ProgressOptions({
  setName,
  setMonth,
  name,
  month,
  data,
}) {
  const uniqueNames = [...new Set(data.map((item) => item.name))];
  const uniqueMonth = [...new Set(data.map((item) => item.month))];
  return (
    <div className="flex items-center justify-center gap-5">
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
        <option value="January" disabled={!uniqueMonth.includes("January")}>
          January
        </option>
        <option value="February" disabled={!uniqueMonth.includes("February")}>
          February
        </option>
        <option value="March" disabled={!uniqueMonth.includes("March")}>
          March
        </option>
        <option value="April" disabled={!uniqueMonth.includes("April")}>
          April
        </option>
        <option value="May" disabled={!uniqueMonth.includes("May")}>
          May
        </option>
        <option value="June" disabled={!uniqueMonth.includes("June")}>
          June
        </option>
        <option value="July" disabled={!uniqueMonth.includes("July")}>
          July
        </option>
        <option value="August" disabled={!uniqueMonth.includes("August")}>
          August
        </option>
        <option value="September" disabled={!uniqueMonth.includes("September")}>
          September
        </option>
        <option value="October" disabled={!uniqueMonth.includes("October")}>
          October
        </option>
        <option value="November" disabled={!uniqueMonth.includes("November")}>
          November
        </option>
        <option value="December" disabled={!uniqueMonth.includes("December")}>
          December
        </option>
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
  data: PropTypes.array.isRequired,
};
