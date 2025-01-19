import {
  FaTasks,
  FaUserShield,
  FaDollarSign,
  FaEnvelope,
} from "react-icons/fa";

const Services = () => {
  const services = [
    {
      icon: <FaTasks className="text-4xl text-blue-600" />,
      title: "Task Management",
      description:
        "Track and update your daily tasks and hours worked effortlessly.",
    },
    {
      icon: <FaUserShield className="text-4xl text-green-600" />,
      title: "Employee Management",
      description:
        "HR can manage employee records, verify accounts, and process payroll.",
    },
    {
      icon: <FaDollarSign className="text-4xl text-yellow-600" />,
      title: "Payroll Approval",
      description: "Admin reviews and approves payment requests for employees.",
    },
    {
      icon: <FaEnvelope className="text-4xl text-red-600" />,
      title: "Contact & Support",
      description:
        "Submit queries or feedback directly to the Admin for resolution.",
    },
  ];

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-6 text-center">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="rounded-lg bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-700">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
