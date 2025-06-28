import CustomerPage from "@/components/customer";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader title="Manajemen Customer" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <CustomerPage />
        </div>
      </div>
    </>
  );
}
