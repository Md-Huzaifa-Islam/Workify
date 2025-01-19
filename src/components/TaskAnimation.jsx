import Lottie from "lottie-react";
import load from "../../public/Animation/task.json";

export default function TaskAnimation() {
  return (
    <div className="mx-auto max-w-[140px]">
      <Lottie animationData={load} loop={true} />
    </div>
  );
}
