import SalesOperation from "@/components/sales-operation-file/sales-operation-page";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader title="Sales Operation" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <SalesOperation />
        </div>
      </div>
    </>
  );
}
