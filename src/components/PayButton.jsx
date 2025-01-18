import { useState } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
const PayButton = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { _id, salary, name, email, verified } = data;
  const axiosSecure = useAxiosSecure();
  const [task2, setTask2] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const handlemMonthChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "custom") {
      setIsCustom(true);
      setTask2("");
    } else {
      setIsCustom(false);
      setTask2(selectedValue);
    }
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const editTask = async (formObject) => {
    const { data } = await axiosSecure.post(`payrolls`, formObject);
    return data;
  };

  const mutation = useMutation({
    mutationFn: editTask,
    onSuccess: () => {
      toggleModal();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());
    formObject.employeeId = _id;
    formObject.name = name;
    formObject.email = email;
    formObject.salary = salary;

    formObject.created = new Date().getTime();
    // post the new task
    mutation.mutate(formObject);
  };

  const renderYearContent = (year) => {
    const tooltipText = `Tooltip for year: ${year}`;
    return <span title={tooltipText}>{year}</span>;
  };

  return (
    <div>
      {/* Modal toggle button */}
      <button
        disabled={!verified}
        onClick={toggleModal}
        className="block rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Pay
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
          onClick={toggleModal} // Close modal when clicking outside
        >
          <div
            className="relative w-full max-w-md rounded-lg bg-white p-4 shadow dark:bg-gray-700"
            onClick={(e) => e.stopPropagation()} // Prevent click propagation to parent
          >
            {/* Modal header */}
            <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 md:p-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Make payment request to Admin
              </h3>
              <button
                onClick={toggleModal}
                className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* Modal body */}
            <form className="mx-auto max-w-sm" onSubmit={handleSubmit}>
              <p>Amount : {salary} $ </p>

              <select
                value={task2}
                name="month"
                onChange={handlemMonthChange}
                className="rounded border px-2 py-1"
                required={!isCustom} // Only required if not using the custom input
              >
                <option value="" disabled>
                  Select Month
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
              <DatePicker
                name="year"
                selected={new Date()}
                renderYearContent={renderYearContent}
                showYearPicker
                dateFormat="yyyy"
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
PayButton.propTypes = {
  data: PropTypes.object,
};

export default PayButton;
