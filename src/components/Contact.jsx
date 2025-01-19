export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}

      {/* Main Content */}
      <main className="container mx-auto my-10 px-4">
        <h2 className="mb-6 text-center text-3xl font-bold text-blue-600">
          Contact Us
        </h2>

        {/* Address Section */}
        <div className="mb-10 text-center">
          <p className="text-lg text-gray-700">📍 1234 Elm Street, Suite 567</p>
          <p className="text-lg text-gray-700">🌍 City, State, ZIP</p>
          <p className="text-lg text-gray-700">📞 +123 456 7890</p>
          <p className="text-lg text-gray-700">✉ info@company.com</p>
        </div>

        {/* Contact Form */}
        <div className="mx-auto max-w-lg rounded-lg bg-white p-8 shadow-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Form submitted!");
            }}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition duration-300 hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
