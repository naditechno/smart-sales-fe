import CostParameterSection from "@/components/configuration-systems/CostParameterSection";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader title="Parameters Fee" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <CostParameterSection/>
        </div>
      </div>
    </>
  );
}
