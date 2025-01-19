import Lottie from "lottie-react";
import load from "../../public/Animation/payment.json";

export default function PaymentAnimation() {
  return (
    <div className="mx-auto max-w-64">
      <Lottie animationData={load} loop={true} />
    </div>
  );
}
