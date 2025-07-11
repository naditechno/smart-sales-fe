"use client";

import { useParams } from "next/navigation";
import { useGetFundingProductByIdQuery } from "@/services/product-services/fundingproduct.service";
import TargetFundingPage from "@/components/management-sales/product/funding-target-page";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  const { id } = useParams();
  const productId = parseInt(id as string);

  const { data: fundingProduct } = useGetFundingProductByIdQuery(productId);

  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title={`Target Produk: ${fundingProduct?.name || "..."}`} />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <TargetFundingPage productId={productId} />
        </div>
      </div>
    </div>
  );
}