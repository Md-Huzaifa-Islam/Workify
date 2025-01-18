import Lottie from "lottie-react";
import load from "../../public/Animation/loading.json";

export default function Loading() {
  return (
    <div className="mx-auto max-w-96">
      <Lottie animationData={load} loop={true} />
    </div>
  );
}
