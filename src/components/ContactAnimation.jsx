import Lottie from "lottie-react";
import load from "../../public/Animation/contact.json";

export default function ContactAnimation() {
  return (
    <div className="mx-auto max-w-36">
      <Lottie animationData={load} loop={true} />
    </div>
  );
}
