'use client';
import FundingAppPage from "@/components/management-sales/applications/funding-app";
import LendingAppPage from "@/components/management-sales/applications/lending-app";
import FundingProductPage from "@/components/management-sales/product/funding-product";
import LendingProductPage from "@/components/management-sales/product/lending-product";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function Page() {
  const[activeTab, setActiveTab] = useState("product");
  return (
    <>
      <SiteHeader title="Manajemen Sales" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <div className="p-6 space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList>
                <TabsTrigger value="product">Product</TabsTrigger>
                <TabsTrigger value="app">Application</TabsTrigger>
              </TabsList>

              <TabsContent value="product">
                {activeTab === "product" && (
                  <>
                    <FundingProductPage /> <LendingProductPage />
                  </>
                )}
              </TabsContent>

              <TabsContent value="app">
                {activeTab === "app" && (
                  <>
                    <FundingAppPage />
                    <LendingAppPage />
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
