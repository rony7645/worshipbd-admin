"use client";

import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Images,
  LayoutDashboard,
  Mails,
  PencilLine,
  Users,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import favicon from "@/public/favicon.png";
import Image from "next/image";
// This is sample data.
const data = {
  user: {
    name: "Admin",
    email: "admin@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },

  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Team Members",
      url: "/dashboard/teams",
      icon: Users,
    },
    {
      title: "Submission",
      url: "/dashboard/submission",
      icon: Mails,
    },
    {
      title: "Case Studies",
      url: "#",
      icon: Images,
      items: [
        {
          title: "All Case Studies",
          url: "/dashboard/case-studies",
        },
        {
          title: "Add New",
          url: "/dashboard/case-studies/add-new",
        },
        {
          title: "Categories",
          url: "/dashboard/case-studies/categories",
        },
      ],
    },
    {
      title: "Blogs",
      url: "#",
      icon: PencilLine,
      items: [
        {
          title: "All Blogs",
          url: "/dashboard/blogs",
        },
        {
          title: "Add New",
          url: "/dashboard/blogs/add-new",
        },
        {
          title: "Categories",
          url: "/dashboard/blogs/categories",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild>
          <a href="#">
            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center ">
              <Image src={favicon} alt="" />
            </div>
            <div className="flex flex-col gap-1.5 leading-none ml-1">
              <span className="font-medium">Worship BD</span>
              <span className="text-[12px]">Complete IT Solutions</span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
