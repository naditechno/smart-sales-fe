import FundingPage from "@/components/management-sales/funding";
import LendingPage from "@/components/management-sales/lending";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader title="Manajemen Sales" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <FundingPage />
          <LendingPage/>
        </div>
      </div>
    </>
  );
}
