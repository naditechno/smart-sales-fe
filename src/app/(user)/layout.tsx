"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type RoleName = "superadmin" | "coordinator" | "sales";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return null;

  const roleName = session?.user?.roles?.[0]?.name as RoleName | undefined;

  if (!roleName) {
    console.warn("Role tidak ditemukan di session.");
    router.replace("/unauthorized");
    return null;
  }

  const role: RoleName = ["superadmin", "coordinator", "sales"].includes(
    roleName
  )
    ? roleName
    : "sales"; // fallback ke "sales" jika tidak dikenal

  console.log("Role dari session:", role);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" role={role} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}