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
        { title: "Brand", url: "/master/brand" },
        { title: "Category", url: "/master/category" },
        { title: "Color", url: "/master/color" },
        { title: "Country Of Origin", url: "/master/countryoforigin" },
        { title: "Dimensions", url: "/master/dimensions" },
        { title: "Fabric", url: "/master/fabric" },
        { title: "Length", url: "/master/length" },
        { title: "Occassion", url: "/master/occassion" },
        { title: "Pattern", url: "/master/pattern" },
        { title: "ProductTypes", url: "/master/producttypes" },
        { title: "Shipping", url: "/master/shipping" },
        { title: "Size", url: "/master/size" },
        { title: "Subcategory", url: "/master/subcategory" },
        { title: "Weight", url: "/master/weight" },
      ],
    },
    {
      title: "Product",
      url: "/products",
      icon: Box,
      items: [
        {
          title: "Product",
          url: "/master/product",
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
