import { useState } from "react";
import useAuth from "../Hooks/CustomHooks";

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

    e.target.reset();
  };
  return (
    <div>
      <p className="pb-5 text-center text-2xl font-semibold sm:text-left sm:text-2xl md:text-2xl lg:text-4xl">
        Still have any question?
      </p>
      <div className="card w-full max-w-sm shrink-0 border">
        <form className="card-body" onSubmit={handleSubmit}>
          <p className="text-center text-2xl font-medium">Ask us</p>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg">Your Question</span>
            </label>
            <input
              type="text"
              placeholder="enter here"
              name="question"
              className="input input-bordered"
              required
            />
          </div>
          <p className="mt-3 text-center text-red-500">{error}</p>
          <div className="form-control">
            <button className="btn btn-primary btn-block mx-auto flex items-center rounded-full border px-5 py-2 text-xl text-white">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
