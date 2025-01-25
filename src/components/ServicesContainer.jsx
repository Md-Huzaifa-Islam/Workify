import SectionHeader from "./SectionHeader";
import Services from "./Services";

export default function ServicesContainer() {
  return (
    <div>
      <SectionHeader
        heading="Our Services"
        subHeading=" Explore the key services we offer to employees, HR, and Admin users."
      />
      <Services />
    </div>
  );
}
