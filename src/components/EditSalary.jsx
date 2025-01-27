import PropTypes from "prop-types";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
const EditSalary = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { salary, name, _id } = data;
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [initialSalary, setInitialSalary] = useState(salary);
  const [error] = useState("You need to increase the salary to change");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const changeSalary = async (formObject) => {
    const { data } = await axiosSecure.patch(`changeSalary`, formObject);
    return data;
  };

  const mutation = useMutation({
    mutationFn: changeSalary,
    onSuccess: () => {
      queryClient.invalidateQueries(["allusers"]);
      toast.success("Successfully changed salary");
      toggleModal();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());
    formObject.id = _id;
    mutation.mutate(formObject);
    // post the new task
  };

  return (
    <div>
      {/* Modal toggle button */}
      <button onClick={toggleModal} className="" type="button">
        <FaRegEdit />
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
                Change salary of {name}
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
              className="mx-auto grid max-w-sm gap-3 py-8"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-1">
                <label htmlFor="">Current Salary ($)</label>
                <input
                  type="number"
                  name="salary"
                  defaultValue={salary}
                  onChange={(e) => {
                    setInitialSalary(e.target.value);
                  }}
                />
              </div>

              {initialSalary <= salary && (
                <p className="text-center text-red-500">{error}</p>
              )}
              <button
                type="submit"
                disabled={initialSalary <= salary}
                className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-slate-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
              >
                Change
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
EditSalary.propTypes = {
  data: PropTypes.object,
};

export default EditSalary;
