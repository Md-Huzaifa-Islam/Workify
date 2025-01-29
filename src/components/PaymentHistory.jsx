import PaymentTable from "./PaymentTable";
import SingleHeader from "./SingleHeader";

export default function PaymentHistory() {
  return (
    <div className="mt-5">
      <div className="pb-2 sm:pb-1 md:pb-2 lg:pb-3">
        <SingleHeader heading="My payment History" />
      </div>
      <PaymentTable />
    </div>
  );
}
