"use client"

import * as React from "react"
import {
  IconDashboard,
  IconDatabase,
  IconReport,
  IconSettings,
  IconUsers,
  IconFileNeutral,
  IconBuildingStore,
  IconUsersGroup,
  IconSettingsCog,
} from "@tabler/icons-react"

// import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

const data = {
  user: {
    name: "Smart Sales",
    email: "superadmin@gmail.com",
    avatar: "/logo-smart-sales.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/superadmin",
      icon: IconDashboard,
    },
    {
      title: "Manajemen Customer",
      url: "/cust-management",
      icon: IconUsersGroup,
    },
    {
      title: "Sales Operation",
      url: "/sales-operation",
      icon: IconFileNeutral,
      children: [
        {
          title: "Sales",
          url: "/sales-operation/sales",
        },
        {
          title: "Sales Target Funding",
          url: "/sales-operation/sales-target-funding",
        },
        {
          title: "Assignment",
          url: "/sales-operation/assignment",
        },
        {
          title: "Task Schedule",
          url: "/sales-operation/task-activity",
        },
        {
          title: "Penugasan Prospect",
          url: "/sales-operation/prospect-assignment",
        },
        {
          title: "Prospect Review",
          url: "/sales-operation/prospect-review",
        },
        {
          title: "Prospect Approval",
          url: "/sales-operation/prospect-approval",
        },
        {
          title: "Rekonsiliasi",
          url: "/sales-operation/reconciliation",
        },
      ],
    },
    {
      title: "Manajemen Sales",
      url: "/sales-management/funding-product",
      icon: IconBuildingStore,
      children: [
        {
          title: "Funding Product",
          url: "/sales-management/funding-product",
        },
        {
          title: "Funding Product Kategori",
          url: "/sales-management/funding-product-category",
        },
        {
          title: "Lending Product",
          url: "/sales-management/lending-product",
        },
        {
          title: "Funding Transaksi",
          url: "/sales-management/funding-transaction",
        },
        {
          title: "Lending Transaksi",
          url: "/sales-management/lending-transaction",
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: IconReport,
    },
    {
      title: "Manajemen Pengguna",
      url: "/users-management",
      icon: IconUsers,
      children: [
        {
          title: "Data Pengguna",
          url: "/users-management",
        },
        {
          title: "Roles & Permissions",
          url: "/users-management/roles-permissions",
        },
      ],
    },
    {
      title: "Master",
      url: "/master",
      icon: IconDatabase,
      children: [
        {
          title: "Sales Category",
          url: "/sales-category",
        },
        {
          title: "Sales Type",
          url: "/sales-type",
        },
        {
          title: "Wilayah Kerja",
          url: "/wilayah-kerja",
        },
        {
          title: "Cabang",
          url: "/cabang",
        },
        {
          title: "Bank",
          url: "/bank",
        },
        {
          title: "Cabang Bank Mitra",
          url: "/cabang-bank-mitra",
        },
      ],
    },
    {
      title: "Configuration System",
      url: "/config-system",
      icon: IconSettingsCog,
      children: [
        {
          title: "Parameter Biaya",
          url: "/config-system/param-fee",
        },
        {
          title: "Optimasi Rute",
          url: "/config-system/optimation-rute",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/setting",
      icon: IconSettings,
    },
  ],
  documents: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Image src="/logo-smart-sales.png" alt="Smart Sales" width={32} height={32} />
                <span className="text-base font-semibold">Smart Sales</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
