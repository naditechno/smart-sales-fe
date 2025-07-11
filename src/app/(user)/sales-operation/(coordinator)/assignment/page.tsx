import AssignmentPage from "@/components/sales-operation-file/assignment-page";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title="Assignment" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
            <AssignmentPage/>
        </div>
      </div>
    </div>
  );
}
