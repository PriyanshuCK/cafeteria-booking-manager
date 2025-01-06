import ThemeColorForm from "@/components/themeColorForm";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BarChart2,
  Users,
  Calendar,
  ClipboardList,
  HelpCircle,
  MessageSquare,
  User,
  Vote,
  Trash,
  UtensilsCrossed,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const items = [
  {
    title: "Overview",
    url: "",
    icon: LayoutDashboard,
    disabled: false,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart2,
    submenu: [
      { title: "Booking Overview", url: "/reports/booking-overview" },
      { title: "Pickup Trends", url: "/reports/pickup-trends" },
    ],
    disabled: false,
  },
  {
    title: "Menu",
    url: "/menu",
    icon: UtensilsCrossed,
    disabled: false,
  },
  {
    title: "Holidays",
    url: "/holidays",
    icon: Calendar,
    disabled: true,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    submenu: [
      { title: "All Users", url: "/users/all" },
      { title: "Add User", url: "/users/add" },
      { title: "Bulk Import", url: "/users/bulk-import" },
    ],
    disabled: false,
  },
  {
    title: "Bookings",
    url: "/bookings",
    icon: ClipboardList,
    submenu: [
      { title: "All Bookings", url: "/bookings/all" },
      { title: "Create Booking", url: "/bookings/create" },
    ],
    disabled: false,
  },
  {
    title: "Leftover",
    url: "/leftover",
    icon: Trash,
    disabled: true,
  },
  {
    title: "Queries",
    url: "/queries",
    icon: HelpCircle,
    disabled: true,
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: MessageSquare,
    disabled: true,
  },
  {
    title: "Polls",
    url: "/polls",
    icon: Vote,
    disabled: true,
  },
  {
    title: "Guests",
    url: "/guests",
    icon: User,
    disabled: true,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <span className="truncate font-semibold">Admin Dashboard</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Group Label</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <Collapsible
                    key={item.title}
                    defaultOpen={false}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      {item.submenu ? (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                              <item.icon />
                              <span className="flex-1">{item.title}</span>
                              <ChevronRight
                                className="transition-transform group-data-[state=open]/collapsible:rotate-90"
                                size={16}
                              />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.submenu.map((subitem) => (
                                <SidebarMenuSubItem key={subitem.title}>
                                  <SidebarMenuButton asChild>
                                    <Link
                                      href={`/admin${subitem.url}`}
                                      className={
                                        item.disabled
                                          ? "pointer-events-none cursor-not-allowed opacity-50"
                                          : ""
                                      }
                                    >
                                      <span>{subitem.title}</span>
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      ) : (
                        <SidebarMenuButton asChild>
                          <Link
                            href={`/admin${item.url}`}
                            className={
                              item.disabled
                                ? "pointer-events-none cursor-not-allowed opacity-50"
                                : ""
                            }
                          >
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
              <SidebarMenuItem>
                <ThemeColorForm />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
