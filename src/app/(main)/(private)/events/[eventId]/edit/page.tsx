import { auth } from "@clerk/nextjs/server";
import React from "react";
import { editEvent } from "../../../../../../../server/actions/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EventForm from "@/components/forms/EventForm";

const editEventPage = async ({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const { eventId } = await params;

  const eventToEdit = await editEvent(userId, eventId);

  if (!eventToEdit) return <h1>Event not found</h1>;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Event</CardTitle>
      </CardHeader>
      <CardContent>
        <EventForm
          event={{
            ...eventToEdit,
            description: eventToEdit.description || undefined,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default editEventPage;
