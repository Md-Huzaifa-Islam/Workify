import { useState } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../Hooks/CustomHooks";
const CrudModal = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { task, hour, _id, date } = data;
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [startDate, setStartDate] = useState(date);
  const [task2, setTask2] = useState(task);
  const [isCustom, setIsCustom] = useState(false);
  const queryClient = useQueryClient();
  const handleTaskChange = (e) => {
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
    const { data } = await axiosSecure.put(`owntask/${_id}`, formObject);
    return data;
  };

  const mutation = useMutation({
    mutationFn: editTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toggleModal();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());
    const dateObject = new Date(formObject.date);
    const timestampInMilliseconds = dateObject.getTime();
    formObject.date = timestampInMilliseconds;
    formObject.email = user.email;
    formObject.created = new Date().getTime();

    // put the new task
    mutation.mutate(formObject);
  };

  return (
    <div>
      {/* Modal toggle button */}
      <button
        onClick={toggleModal}
        className="mx-auto block rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Edit
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
                Update
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
            <form
              className="mx-auto grid max-w-sm grid-rows-3 gap-2 py-8"
              onSubmit={handleSubmit}
            >
              <select
                value={task2}
                name="task"
                onChange={handleTaskChange}
                className="rounded border px-2 py-1"
                required={!isCustom} // Only required if not using the custom input
              >
                <option value="" disabled>
                  Select Task
                </option>
                <option value="Sales">Sales</option>
                <option value="Support">Support</option>
                <option value="Content">Content</option>
                <option value="Paper-work">Paper-work</option>
                <option value="custom">Custom Task</option>
              </select>

              <div className="">
                <input
                  type="number"
                  name="hour"
                  defaultValue={hour}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  required
                />
              </div>
              <DatePicker
                className="w-full"
                showIcon
                name="date"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
CrudModal.propTypes = {
  data: PropTypes.object,
};

export default CrudModal;
