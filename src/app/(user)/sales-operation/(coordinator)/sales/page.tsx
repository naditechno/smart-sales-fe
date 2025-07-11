import SalesPage from "@/components/sales-operation-file/sales-page";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title="Sales" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
            <SalesPage/>
        </div>
      </div>
    </div>
  );
}
