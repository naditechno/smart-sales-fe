import ProspectAssignmentPage from "@/components/sales-operation-file/propects/prospect-assignment-page";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader title="Prospect Assignment" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <ProspectAssignmentPage/>
        </div>
      </div>
    </>
  );
}
