import { useState } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
const PayButton = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { _id, salary, name, email, verified } = data;
  const axiosSecure = useAxiosSecure();
  const [month, setMonth] = useState(new Date());
  const [year, setYear] = useState(new Date());

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
      setMonth(new Date());
      setYear(new Date());
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
    const monthName = format(month, "MMMM");
    const year2 = format(year, "yyyy");
    const monthIndex = new Date(`${monthName} 1, ${year2}`).getMonth();
    const date = new Date(year2, monthIndex);
    const milliseconds = date.getTime();
    formObject.month = monthName;
    formObject.year = year2;
    formObject.payDate = milliseconds;

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

              <DatePicker
                // For extracting the value
                selected={month} // No state needed
                // Handles month selection
                onChange={(d) => setMonth(d)}
                dateFormat="MMMM" // Displays only month name
                showMonthYearPicker // Enables month-only view
                showYearDropdown={false} // Hides year dropdown
                showYearPicker={false}
              />
              <DatePicker
                selected={year}
                onChange={(d) => setYear(d)}
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
