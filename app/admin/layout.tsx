import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { DateRangeProvider } from "./contexts/DateRangeContext";
import { DateRangeSelector } from "@/components/date-range-selector";
import { BookingProvider } from "./contexts/BookingsContext";

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
          <SidebarTrigger />
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
