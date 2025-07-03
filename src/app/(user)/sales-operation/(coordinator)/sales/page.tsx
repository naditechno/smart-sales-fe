import SalesPage from "@/components/sales-operation-file/sales-page";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader title="Sales" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
            <SalesPage/>
        </div>
      </div>
    </>
  );
}
