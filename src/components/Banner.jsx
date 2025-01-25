import BannerSlider from "./BannerSlider";

export default function Banner() {
  return (
    <div className="grid items-center gap-10 px-5 text-center md:container sm:grid-cols-2 sm:gap-3 sm:text-left md:mx-auto md:gap-6 lg:gap-10">
      <div className="grid gap-4">
        <p className="text-4xl font-bold sm:text-3xl/tight md:text-4xl/tight lg:text-5xl/tight">
          Streamline Your Workforce Management
        </p>
        <p className="mx-auto text-lg font-medium opacity-70 sm:mx-0 sm:w-3/4 sm:text-sm md:text-base lg:text-lg">
          Track tasks, manage payments, and handle HR & admin processes
          effortlessly—your all-in-one solution for efficient team operations.
        </p>
      </div>
      <div className="hidden sm:block">
        <BannerSlider />
      </div>
    </div>
  );
}
