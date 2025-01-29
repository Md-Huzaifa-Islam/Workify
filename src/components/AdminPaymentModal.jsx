import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
const AdminPaymentModal = ({ data }) => {
  const { _id, salary, name, paymentDate } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  //   new added
  const HandlePay = async (tId) => {
    const { data } = await axiosSecure.patch(`payrolls/${_id}`, { tId: tId });
    return data;
  };

  const mutation = useMutation({
    mutationFn: HandlePay,
    onSuccess: () => {
      queryClient.invalidateQueries(["payrolls"]);
      setLoading(false);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    const amount = e.target.amount.value * 100;
    const { data } = await axiosSecure.post("stripe", { amount });
    const { clientSecret, transactionId } = data;
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card: elements.getElement(CardElement) },
      },
    );
    if (error) {
      setErrorMessage(error.message);
    } else if (paymentIntent.status === "succeeded") {
      mutation.mutate(transactionId);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Payment is successful !",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div>
      {/* Modal toggle button */}
      <button
        onClick={toggleModal}
        disabled={paymentDate}
        className="mx-auto block rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-slate-600 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:px-5 sm:py-2.5"
        type="button"
      >
        {paymentDate ? "Paid" : "Pay"}
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
                Paying {name}
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
              className="mx-auto grid max-w-sm gap-4"
              onSubmit={handleClick}
            >
              <div className="flex flex-col">
                <label htmlFor="">Salary</label>
                <input type="number" name="amount" defaultValue={salary} />
              </div>
              <div>
                <label htmlFor="">You card</label>
                <CardElement className="rounded border p-3" />
              </div>
              <button
                type="submit"
                disabled={!stripe || loading}
                className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
              >
                {loading ? "Processing..." : `Pay`}
              </button>
              {errorMessage && (
                <p className="mt-2 text-red-500">{errorMessage}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
AdminPaymentModal.propTypes = {
  data: PropTypes.object,
};

export default AdminPaymentModal;
