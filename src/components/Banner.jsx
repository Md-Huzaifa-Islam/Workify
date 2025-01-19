import BannerSlider from "./BannerSlider";

export default function Banner() {
  return (
    <div className="grid grid-cols-2 items-center gap-10 px-5 md:container md:mx-auto">
      <div className="grid gap-4">
        <p className="text-5xl/tight font-bold">
          Streamline Your Workforce Management
        </p>
        <p className="w-3/4 text-lg font-medium opacity-70">
          Track tasks, manage payments, and handle HR & admin processes
          effortlessly—your all-in-one solution for efficient team operations.
        </p>
      </div>
      <BannerSlider />
    </div>
  );
}
