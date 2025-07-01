'use client';
import LendingApplicationPage from "@/components/management-sales/applications/lending-app";
import { SiteHeader } from "@/components/site-header";


export default function Page() {
  return (
    <>
      <SiteHeader title="Manajemen Sales" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
            <LendingApplicationPage />
        </div>
      </div>
    </>
  );
}
