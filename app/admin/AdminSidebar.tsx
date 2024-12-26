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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
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

const items = [
  {
    title: "Overview",
    url: "",
    icon: LayoutDashboard,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart2,
    submenu: [
      { title: "Booking Overview", url: "/reports/booking-overview" },
      { title: "Pickup Trends", url: "/reports/pickup-trends" },
    ],
  },
  {
    title: "Menu",
    url: "/menu",
    icon: UtensilsCrossed,
  },
  {
    title: "Holidays",
    url: "/holidays",
    icon: Calendar,
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
  },
  {
    title: "Bookings",
    url: "/bookings",
    icon: ClipboardList,
    submenu: [
      { title: "All Bookings", url: "/bookings/all" },
      { title: "Create Booking", url: "/bookings/create" },
    ],
  },
  {
    title: "Leftover",
    url: "/leftover",
    icon: Trash,
  },
  {
    title: "Queries",
    url: "/queries",
    icon: HelpCircle,
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: MessageSquare,
  },
  {
    title: "Polls",
    url: "/polls",
    icon: Vote,
  },
  {
    title: "Guests",
    url: "/guests",
    icon: User,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
                                  <a href={`/admin${subitem.url}`}>
                                    <span>{subitem.title}</span>
                                  </a>
                                </SidebarMenuButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : (
                      <SidebarMenuButton asChild>
                        <a href={`/admin${item.url}`}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
