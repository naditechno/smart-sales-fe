import ProspectReviewPage from "@/components/sales-operation-file/propects/prospect-review";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader title="Prospect Review" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <ProspectReviewPage />
        </div>
      </div>
    </>
  );
}
