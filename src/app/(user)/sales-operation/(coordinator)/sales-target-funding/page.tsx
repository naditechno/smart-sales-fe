import SalesTargetFundingPage from "@/components/sales-operation-file/sales-target";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title="Sales Target Funding" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
            <SalesTargetFundingPage/>
        </div>
      </div>
    </div>
  );
}
