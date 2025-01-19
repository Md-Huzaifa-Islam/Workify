import Lottie from "lottie-react";
import load from "../../public/Animation/management.json";

export default function ManagementAnimation() {
  return (
    <div className="mx-auto max-w-32">
      <Lottie animationData={load} loop={true} />
    </div>
  );
}
