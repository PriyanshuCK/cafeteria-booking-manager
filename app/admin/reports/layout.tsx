import { DateRangeSelector } from "@/components/date-range-selector";

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <h2 className="text-2xl font-semibold mt-2">Reports</h2>
      <div className="flex items-center gap-4 mb-6">
        <p>Showing reports in date range:</p>
        <DateRangeSelector />
      </div>
      {children}
    </>
  );
}
