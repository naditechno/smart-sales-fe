'use client';
import FundingCategoryPage from "@/components/management-sales/product/funding-product-category";
import { SiteHeader } from "@/components/site-header";


export default function Page() {
  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title="Manajemen Sales" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
            <FundingCategoryPage/>
        </div>
      </div>
    </div>
  );
}
