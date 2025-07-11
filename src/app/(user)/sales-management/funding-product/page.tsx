'use client';
import FundingProductPage from "@/components/management-sales/product/funding-product";
import { SiteHeader } from "@/components/site-header";


export default function Page() {
  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title="Manajemen Sales" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <FundingProductPage />
        </div>
      </div>
    </div>
  );
}
