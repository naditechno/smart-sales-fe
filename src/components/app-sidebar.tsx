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
      url: "/admin/dashboard/superadmin",
      icon: IconDashboard,
    },
    {
      title: "Manajemen Customer",
      url: "/admin/cust-management",
      icon: IconUsersGroup,
    },
    {
      title: "Sales Operation",
      url: "/admin/sales-operation",
      icon: IconFileNeutral,
      children: [
        {
          title: "Sales",
          url: "/admin/sales-operation/sales",
        },
        {
          title: "Assignment",
          url: "/admin/sales-operation/assignment",
        },
        {
          title: "Task Activity",
          url: "/admin/sales-operation/task-activity",
        },
        {
          title: "Penugasan Prospect",
          url: "/admin/sales-operation/prospect-assignment",
        },
        {
          title: "Prospect Review",
          url: "/admin/sales-operation/prospect-review",
        },
        {
          title: "Prospect Approval",
          url: "/admin/sales-operation/prospect-approval",
        },
        {
          title: "Rekonsiliasi",
          url: "/admin/sales-operation/reconciliation",
        },
      ],
    },
    {
      title: "Manajemen Sales",
      url: "/admin/sales-management/funding-product",
      icon: IconBuildingStore,
      children: [
        {
          title: "Funding Product",
          url: "/admin/sales-management/funding-product",
        },
        {
          title: "Lending Product",
          url: "/admin/sales-management/lending-product",
        },
        {
          title: "Funding Transaksi",
          url: "/admin/sales-management/funding-transaction",
        },
        {
          title: "Lending Transaksi",
          url: "/admin/sales-management/lending-transaction",
        },
      ],
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: IconReport,
    },
    {
      title: "Manajemen Pengguna",
      url: "/admin/users-management",
      icon: IconUsers,
      children: [
        {
          title: "Data Pengguna",
          url: "/admin/users-management",
        },
        {
          title: "Roles & Permissions",
          url: "/admin/users-management/roles-permissions",
        },
      ],
    },
    {
      title: "Master",
      url: "/admin/master",
      icon: IconDatabase,
      children: [
        {
          title: "Sales Category",
          url: "/admin/sales-category",
        },
      ],
    },
    {
      title: "Configuration System",
      url: "/admin/config-system",
      icon: IconSettingsCog,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/setting",
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
