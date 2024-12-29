import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { DateRangeProvider } from "./contexts/DateRangeContext";
import { DateRangeSelector } from "@/components/date-range-selector";
import { BookingProvider } from "./contexts/BookingsContext";
import DynamicBreadCrumb from "@/components/dynamic-breadcrumb";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadCrumb />
            </div>
          </header>
          <DateRangeProvider>
            <BookingProvider>
              <DateRangeSelector />
              {children}
            </BookingProvider>
          </DateRangeProvider>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
