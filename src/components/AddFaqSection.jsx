import { useState } from "react";
import { useAuth } from "../Hooks/CustomHooks";

export default function AddFaqSection() {
  const { user } = useAuth();
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setError("You need to login to post faq");
      return;
    }
    setError("");
    console.log(e.target.question.value);
  };
  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <p>Still have any question?</p>
      <form className="card-body" onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Your Question</span>
          </label>
          <input
            type="text"
            placeholder="faq"
            name="question"
            className="input input-bordered"
            required
          />
        </div>
        <p className="mt-6 text-center text-red-500">{error}</p>
        <div className="form-control">
          <button className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
}
