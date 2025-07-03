import SalesCategoryPage from "@/components/sales-category";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader title="Sales Category" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <SalesCategoryPage />
        </div>
      </div>
    </>
  );
}
