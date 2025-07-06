"use server";

// =============================================================================
// Event Server Actions
// =============================================================================
// These functions run exclusively on the server (see "use server" directive).
// Each function:
//   1. Authenticates the user via Clerk.
//   2. Validates input data using Zod schemas.
//   3. Interacts with the database through Drizzle ORM.
//   4. Revalidates the cached "/events" page to ensure fresh content.
//   5. Redirects the client to "/events" after the operation completes.
// =============================================================================

import { z } from "zod";
import { eventsFormSchema } from "../../schema/events";
import { auth } from "@clerk/nextjs/server";
import { db } from "../../drizzle/db";
import { EventsTable } from "../../drizzle/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";

/**
 * Creates a new event linked to the authenticated user.
 *
 * @param rawData - Raw, untrusted input from the client.
 * @throws Throws an error if validation fails or user is unauthenticated.
 */
export const createEvent = async (
  rawData: z.infer<typeof eventsFormSchema>
): Promise<void> => {
  try {
    const { userId } = await auth();
    const { success, data } = eventsFormSchema.safeParse(rawData);
    if (!success || !userId) {
      throw new Error("Invalid data or user not authenticated");
    }
    await db.insert(EventsTable).values({
      name: data.name,
      description: data.description ?? "",
      duration: data.duration,
      clerkUserId: userId,
      isActive: data.isActive,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }
    throw new Error("Failed to create event: Unknown error");
  } finally {
    revalidatePath("/events");
    redirect("/events");
  }
};

/**
 * Updates an existing event owned by the authenticated user.
 *
 * @param id - Primary key of the event to update.
 * @param rawData - Raw, untrusted input from the client.
 * @throws Throws an error if validation fails, user is unauthenticated,
 *         or if no matching event is found to update.
 */
export const updateEvent = async (
  id: string,
  rawData: z.infer<typeof eventsFormSchema>
): Promise<void> => {
  try {
    const { userId } = await auth();
    const { success, data } = eventsFormSchema.safeParse(rawData);
    if (!success || !userId) {
      throw new Error("Invalid data or user not authenticated");
    }
    const { rowCount } = await db
      .update(EventsTable)
      .set({ ...data })
      .where(and(eq(EventsTable.id, id), eq(EventsTable.clerkUserId, userId)));
    if (rowCount === 0) {
      throw new Error("Failed to update event");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }
    throw new Error("Failed to update event: Unknown error");
  } finally {
    revalidatePath("/events");
    redirect("/events");
  }
};

/**
 * Deletes an event owned by the authenticated user.
 *
 * @param id - Primary key of the event to delete.
 * @throws Throws an error if user is unauthenticated or deletion fails.
 */
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const { rowCount } = await db
      .delete(EventsTable)
      .where(and(eq(EventsTable.id, id), eq(EventsTable.clerkUserId, userId)));
    if (rowCount === 0) {
      throw new Error("Failed to delete event");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
    throw new Error("Failed to delete event: Unknown error");
  } finally {
    revalidatePath("/events");
    redirect("/events");
  }
};

type EventRow = typeof EventsTable.$inferSelect;
export const getEvents = async (clerkUserId: string): Promise<EventRow[]> => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const events = await db.query.EventsTable.findMany({
    where: ({ clerkUserId: userIdcol }, { eq }) => eq(userIdcol, clerkUserId),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  });
  return events;
};

export const editEvent = async (
  userId: string,
  eventId: string
): Promise<EventRow | undefined> => {
  const event = await db.query.EventsTable.findFirst({
    where: ({ id, clerkUserId }, { and, eq }) =>
      and(eq(id, eventId), eq(clerkUserId, userId)),
  });
  return event ?? undefined;
};
