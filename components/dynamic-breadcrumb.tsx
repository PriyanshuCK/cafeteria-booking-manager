"use client";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const navigationItems = {
  users: [
    { title: "All Users", href: "/admin/users/all" },
    { title: "Add User", href: "/admin/users/add" },
    { title: "Bulk Import", href: "/admin/users/bulk-import" },
  ],
  reports: [
    { title: "Booking Overview", href: "/admin/reports/booking-overview" },
    { title: "Pickup Trends", href: "/admin/reports/pickup-trends" },
  ],
  bookings: [
    { title: "All Bookings", href: "/admin/bookings/all" },
    { title: "Create Booking", href: "/admin/bookings/create" },
  ],
};

export default function DynamicBreadCrumb() {
  const paths = usePathname();
  const segments = paths.split("/").filter((path) => path !== "");
  const dashboardType = segments[0] as "admin" | "user" | "guest";

  const hasSubItems = (segment: string) => {
    return segment in navigationItems;
  };

  const getCurrentSubItem = (segment: string, currentPath: string[]) => {
    const items = navigationItems[segment as keyof typeof navigationItems];
    return items?.find(
      (item) =>
        item.href.split("/").pop() ===
        currentPath[currentPath.indexOf(segment) + 1]
    );
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;

          if (hasSubItems(segment)) {
            const currentSubItem = getCurrentSubItem(segment, segments);

            return (
              <Fragment key={segment}>
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 capitalize hover:text-primary">
                      {segment}
                      <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {navigationItems[
                        segment as keyof typeof navigationItems
                      ].map((item) => (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link
                            href={item.href}
                            className={
                              currentSubItem?.href === item.href
                                ? "font-medium"
                                : ""
                            }
                          >
                            {item.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            );
          }

          return (
            <Fragment key={segment}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize">
                    {segment}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={
                      segment === dashboardType
                        ? `/${dashboardType}`
                        : `/${dashboardType}/${segment}`
                    }
                    className="capitalize"
                  >
                    {segment}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
