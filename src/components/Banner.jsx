import BannerSlider from "./BannerSlider";

export default function Banner() {
  return (
    <div className="grid grid-cols-2 items-center">
      <div>
        <p>My-Task Hr & Project Management System</p>
        <p>
          This is a solution for everyone. Although it is at the heart of Scrum
          and is typically used by software development teams, it can be
          successfully applied to other businesses, as well as used for
          improving personal productivity.
        </p>
      </div>
      <BannerSlider />
    </div>
  );
}
