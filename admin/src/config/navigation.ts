import {
  LayoutDashboard,
  Box,
  Users,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavSubItem = {
  title: string;
  url: string;
};

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: NavSubItem[];
};

export const navigationConfig: { navMain: NavItem[] } = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Master",
      url: "/master",
      icon: Shield,
      items: [
        {
          title: "General Settings",
          url: "/master/settings",
        },
        {
          title: "Store Config",
          url: "/master/store",
        },
      ],
    },
    {
      title: "Product",
      url: "/products",
      icon: Box,
      items: [
        {
          title: "All Products",
          url: "/products/all",
        },
        {
          title: "Categories",
          url: "/products/categories",
        },
        {
          title: "Brands",
          url: "/products/brands",
        },
        {
          title: "Tags",
          url: "/products/tags",
        },
      ],
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
      items: [
        {
          title: "Customers",
          url: "/users/customers",
        },
        {
          title: "Admins",
          url: "/users/admins",
        },
      ],
    },
  ],
};
