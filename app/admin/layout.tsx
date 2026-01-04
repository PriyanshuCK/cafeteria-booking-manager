import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { DateRangeProvider } from "./contexts/DateRangeContext";
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
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadCrumb />
            </div>
            <div className="px-4">
              <form
                action={async () => {
                  "use server";
                  const { signOut } = await import("@/auth");
                  await signOut();
                }}
              >
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                  Sign Out
                </button>
              </form>
            </div>
          </header>
          <DateRangeProvider>
            <BookingProvider>{children}</BookingProvider>
          </DateRangeProvider>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
