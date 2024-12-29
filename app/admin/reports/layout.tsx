import { DateRangeSelector } from "@/components/date-range-selector";

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DateRangeSelector />
      {children}
    </>
  );
}
