import TodayMenu from "@/components/TodayMenu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-64 sm:h-96 gap-2">
        <h1 className="font-bold text-2xl sm:text-4xl">
          Streamline Your Lunch Booking
        </h1>
        <p className="mb-4">
          Effortlessly book your lunch, check menus, and track your meals—all in
          one place.
        </p>
        <Link href={"/login"}>
          <Button>Get Started</Button>
        </Link>
      </div>
      <div>
        <TodayMenu />
      </div>
    </>
  );
}
