import AnimatedWrapper from "@/components/AnimatedWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { CalendarPlus2, CalendarRange } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { getEvents } from "../../../../../server/actions/events";
import EventCard from "@/components/EventCard";

const EventsPage = async () => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }
  const events = await getEvents(userId);

  return (
    <AnimatedWrapper>
      <main className="py-35 px-5 flex flex-col items-center gap-15 ">
        <div className="flex-col gap-8 items-baseline">
          <h1 className="text-gray-500 text-2xl text-center">SKeduled</h1>
          <Button
            asChild
            size={"xl"}
            className="bg-gray-600 text-white hover:bg-gray-500 hover:scale-95 hover:cursor-pointer text-xl font-semibold mt-8">
            <Link
              href="/events/new"
              className="flex items-center gap-2 text-sm">
              <CalendarPlus2 className="" /> New Event
            </Link>
          </Button>
        </div>
        <div>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-10">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  {...{ ...event, description: event.description ?? undefined }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5">
              <CalendarRange className="size-50 mx-auto text-blue-500" />
              <p className="text-gray-500 text-lg px-5 tracking-wider text-center">
                No events found.
                <br />
                Create your first event to get started
              </p>
            </div>
          )}
        </div>
      </main>
    </AnimatedWrapper>
  );
};

export default EventsPage;
