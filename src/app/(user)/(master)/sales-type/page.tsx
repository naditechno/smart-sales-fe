import SalesTypePage from "@/components/master/sales-type";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title="Sales Type" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
            <SalesTypePage/>
        </div>
      </div>
    </div>
  );
}
