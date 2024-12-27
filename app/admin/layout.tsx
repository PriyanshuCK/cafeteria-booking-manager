import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { DateRangeProvider } from "./contexts/DateRangeContext";
import { DateRangeSelector } from "@/components/date-range-selector";
import { BookingProvider } from "./contexts/BookingsContext";
import DynamicBreadCrumb from "@/components/dynamic-breadcrumb";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider>
        <AdminSidebar />
        <main className="w-full">
          <div className="flex items-start gap-1">
            <SidebarTrigger />
            <span>|</span>
            <DynamicBreadCrumb />
          </div>
          <DateRangeProvider>
            <BookingProvider>
              <DateRangeSelector />
              {children}
            </BookingProvider>
          </DateRangeProvider>
        </main>
      </SidebarProvider>
    </>
  );
}
