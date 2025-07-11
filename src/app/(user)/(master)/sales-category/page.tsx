import SalesCategoryPage from "@/components/master/sales-category";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title="Sales Category" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <SalesCategoryPage />
        </div>
      </div>
    </div>
  );
}
