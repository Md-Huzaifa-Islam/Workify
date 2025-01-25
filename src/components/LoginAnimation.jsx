import Lottie from "lottie-react";
import load from "../../public/Animation/login.json";

export default function LoginAnimation() {
  return (
    <div className="">
      <Lottie animationData={load} loop={true} />
    </div>
  );
}
