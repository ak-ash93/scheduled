"use client";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { CalendarPlus2 } from "lucide-react";

const EventsPage = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }
  }, []);
  return (
    <main
      ref={mainRef}
      className="py-35 px-5 flex flex-col items-center gap-15 ">
      <div className="flex-col gap-8 items-baseline">
        <h1 className="text-gray-500 text-2xl text-center">SKeduled</h1>
        <Button
          asChild
          size={"md"}
          className="bg-gray-600 text-white hover:bg-gray-500 hover:scale-95 hover:cursor-pointer text-xl font-semibold mt-3">
          <Link href="/events/new" className="flex items-center gap-2 text-sm">
            <CalendarPlus2 className="" /> New Event
          </Link>
        </Button>
      </div>
    </main>
  );
};

export default EventsPage;
