import { useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { useAuth } from "../Hooks/CustomHooks";
import { useNavigate } from "react-router-dom";
const AddTestimonial = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const queryClient = useQueryClient();
  const toggleModal = () => {
    if (!user) {
      navigate("/login");
    }
    setRating(0);
    setIsModalOpen(!isModalOpen);
  };

  const addReview = async (formObject) => {
    const { data } = await axiosSecure.post(`addreview`, formObject);
    return data;
  };

  const mutation = useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      toggleModal();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const review = e.target.review.value;
    const name = user?.displayName;
    const photo = user?.photoURL;
    const payLoad = {
      name,
      review,
      photo,
      rating,
    };
    mutation.mutate(payLoad);
    // window close
  };

  return (
    <div>
      {/* Modal toggle button */}
      <button
        onClick={toggleModal}
        className="block rounded-lg bg-blue-700 px-5 py-2.5 text-center text-lg font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Add Your Recommendation
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
            <div className="grid grid-cols-3 justify-items-center rounded-t border-b p-4 dark:border-gray-600 md:p-5">
              <div></div>
              <h3 className="mx-auto whitespace-nowrap text-2xl font-bold dark:text-white">
                Add your review
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

            <form
              className="min-w-80 max-w-md rounded-lg border p-8 py-10"
              onSubmit={handleSubmit}
            >
              <div className="mb-5">
                <label
                  htmlFor="review"
                  className="mb-2 block text-lg font-medium text-gray-900 dark:text-white"
                >
                  Your review
                </label>

                <textarea
                  name="review"
                  rows={4}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Your review"
                  required
                ></textarea>
              </div>
              <div className="mb-5">
                <label
                  htmlFor="rating"
                  className="mb-2 block text-lg font-medium text-gray-900 dark:text-white"
                >
                  Give Rating
                </label>
                <Rating
                  style={{ maxWidth: 150 }}
                  value={rating}
                  onChange={setRating}
                  isRequired
                />
              </div>

              <button
                type="submit"
                disabled={rating == 0}
                className="w-full rounded-lg bg-blue-700 px-8 py-3 text-center text-lg font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-slate-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTestimonial;
