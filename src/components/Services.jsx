import TaskAnimation from "./TaskAnimation";
import ManagementAnimation from "./managementAnimation";
import PaymentAnimation from "./PaymentAnimation";
import ContactAnimation from "./ContactAnimation";

const Services = () => {
  return (
    <section className="">
      <div className="container mx-auto px-6 text-center">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-6 sm:p-2 sm:py-4 md:p-3 md:py-3 lg:p-6">
            <div className="mb-4">
              <TaskAnimation />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Task Management</h3>
            <p className="">
              Track and update your daily tasks and hours worked effortlessly.
            </p>
          </div>
          <div className="rounded-lg border p-6 sm:p-2 sm:py-4 md:p-3 md:py-3 lg:p-6">
            <div className="mb-4">
              <ManagementAnimation />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Employee Management</h3>
            <p className="">
              HR can manage employee records, verify accounts, and process
              payroll.
            </p>
          </div>
          <div className="rounded-lg border p-6 sm:p-2 sm:py-4 md:p-3 md:py-3 lg:p-6">
            <div className="mb-4">
              <PaymentAnimation />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Payroll Approval</h3>
            <p className="">
              Admin reviews and approves payment requests for employees.
            </p>
          </div>
          <div className="rounded-lg border p-6 sm:p-2 sm:py-4 md:p-3 md:py-3 lg:p-6">
            <div className="mb-4">
              <ContactAnimation />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Contact & Support</h3>
            <p className="">
              Submit queries or feedback directly to the Admin for resolution.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
