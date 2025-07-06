"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { eventDescription } from "@/lib/formatters";
import CopyEvent from "./CopyEvent";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";

interface EventCardProps {
  name: string;
  description?: string;
  duration: number;
  isActive: boolean;
  id: string;
  clerkUserId: string;
}

const EventCard = ({
  id,
  isActive,
  name,
  description,
  duration,
  clerkUserId,
}: EventCardProps) => {
  return (
    <Card
      className={cn(
        "flex flex-col p-8 rounded-2xl text-white transform-gpu transition-all duration-300 ease-in-out",
        "shadow-[0_6px_25px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:scale-[1.02]",
        "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900",
        !isActive && "opacity-70 grayscale"
      )}>
      <CardHeader className="text-center capitalize">
        <CardTitle className="text-xl font-semibold tracking-wide border-b border-gray-600 pb-2">
          {name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-300 tracking-wide mt-2">
          Duration: {eventDescription(duration)}
        </CardDescription>
      </CardHeader>

      {description && (
        <CardContent className="mt-4">
          <p className="text-sm leading-relaxed text-gray-200 break-words whitespace-pre-wrap">
            {description}
          </p>
        </CardContent>
      )}

      <CardFooter className="flex justify-between gap-5 w-full  mt-auto p-4">
        {isActive && (
          <CopyEvent
            id={id}
            clerkUserId={clerkUserId}
            className={
              "text-white text-md cursor-pointer border-1 border-gray-400 hover:bg-gray-600 rounded-xl "
            }
          />
        )}
        <Button
          size={"lg"}
          className="bg-blue-500 px-8 hover:bg-blue-600 tracking-wider text-white"
          asChild>
          <Link href={`/events/${id}/edit`}> Edit</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
