export default function ContactForm() {
  const handleSendMessage = (e) => {
    e.preventDefault();

    e.target.reset();
  };
  return (
    <div className="mx-auto grid w-full gap-8 rounded-lg border-2 border-white p-10 shadow-lg sm:max-w-md md:max-w-lg lg:mx-0 lg:max-w-sm">
      <p className="text-center text-2xl font-semibold">Send us a message</p>
      <form className="grid gap-4" onSubmit={handleSendMessage}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Input your name"
            name="name"
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="email"
            name="email"
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Message</span>
          </label>

          <textarea
            className="textarea textarea-bordered"
            placeholder="Your message"
            name="message"
            required
          ></textarea>
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary font-medium">Send</button>
        </div>
      </form>
    </div>
  );
}
