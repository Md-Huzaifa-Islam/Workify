import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useAuth } from "../Hooks/CustomHooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export default function WorkSheetForm() {
  const queryClient = useQueryClient();
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

  const addtask = async (obj) => {
    const { data } = await axiosSecure.post("addtask", obj);
    return data;
  };

  const mutation = useMutation({
    mutationFn: addtask,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());
    const dateObject = new Date(formObject.date);
    const timestampInMilliseconds = dateObject.getTime();
    formObject.date = timestampInMilliseconds;
    formObject.month = format(new Date(timestampInMilliseconds), "MMMM");
    formObject.email = user.email;
    formObject.name = user.displayName;
    formObject.created = new Date().getTime();

    // post the new task
    mutation.mutate(formObject);

    // Clear form
    setTask("");
    setIsCustom(false);
    e.target.reset();
  };
  return (
    <div>
      <form
        className="mx-auto flex flex-wrap items-center justify-center gap-5"
        onSubmit={handleSubmit}
      >
        <select
          value={task}
          name="task"
          onChange={handleTaskChange}
          className=""
          required={!isCustom} // Only required if not using the custom input
        >
          <option value="" disabled>
            Select Task
          </option>
          <option value="Sales">Sales</option>
          <option value="Support">Support</option>
          <option value="Content">Content</option>
          <option value="Paper work">Paper-work</option>
        </select>

        <input
          type="number"
          name="hour"
          placeholder="Hour"
          className=""
          required
        />
        <DatePicker
          showIcon
          name="date"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />

        <button
          type="submit"
          className="h-full rounded-lg bg-blue-800 px-5 py-2 text-white"
        >
          Add
        </button>
      </form>
    </div>
  );
}
