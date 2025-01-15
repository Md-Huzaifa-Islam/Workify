import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useAuth } from "../Hooks/CustomHooks";

export default function WorkSheetForm() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [startDate, setStartDate] = useState(new Date());
  const [task, setTask] = useState("");

  const [isCustom, setIsCustom] = useState(false);

  const handleTaskChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "custom") {
      setIsCustom(true);
      setTask("");
    } else {
      setIsCustom(false);
      setTask(selectedValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());
    const dateObject = new Date(formObject.date);
    const timestampInMilliseconds = dateObject.getTime();
    formObject.date = timestampInMilliseconds;
    formObject.email = user.email;
    formObject.created = new Date();

    // post the new task
    axiosSecure
      .post("addtask", formObject)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));

    // Clear form
    setTask("");
    setIsCustom(false);
    e.target.reset();
  };
  return (
    <div>
      <form className="mx-auto max-w-sm" onSubmit={handleSubmit}>
        <select
          value={task}
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

        <div className="mb-5">
          <input
            type="number"
            name="hour"
            placeholder="Hour"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            required
          />
        </div>
        <DatePicker
          showIcon
          name="date"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
