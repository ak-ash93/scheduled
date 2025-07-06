"use client";

// =============================================================================
// <EventForm /> – Client Component
// =============================================================================
// Renders a form used for both **creating** and **editing** events.
// Uses React‑Hook‑Form (RHF) for state management and validation, Zod for
// schema enforcement, and shadcn‑ui components for consistent styling.
// -----------------------------------------------------------------------------
// Key responsibilities:
//   • Display inputs (name, duration, description, active status)
//   • Validate user input using `eventsFormSchema`
//   • Decide whether to call `createEvent` or `updateEvent`
//   • Provide a destructive action to **delete** an existing event
//   • Show error banners and disable controls while submitting
// -----------------------------------------------------------------------------
// Props
// -----
// `event?` – when provided, the form is in **edit** mode; otherwise it is in
//            **create** mode.  (Undefined/null means *new* event.)
// =============================================================================

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { eventsFormSchema } from "../../../schema/events";
import { zodResolver } from "@hookform/resolvers/zod";
// shadcn‑ui form primitives
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../../server/actions/events";

// -----------------------------------------------------------------------------
// Component definition
// -----------------------------------------------------------------------------
const EventForm = ({
  event,
}: {
  event?: {
    id: string;
    name: string;
    description?: string;
    duration: number;
    isActive: boolean;
  };
}) => {
  // ---------------------------------------------------------------------------
  // React state
  // ---------------------------------------------------------------------------
  // Transition hook to keep the UI responsive during *delete* operations.
  const [isDeletePending, startDeleteTransition] = React.useTransition();

  // ---------------------------------------------------------------------------
  // React‑Hook‑Form initialisation
  // ---------------------------------------------------------------------------
  const form = useForm<z.infer<typeof eventsFormSchema>>({
    resolver: zodResolver(eventsFormSchema), // integrate Zod validation
    defaultValues: event
      ? { ...event } // edit mode – pre‑fill with existing data
      : {
          // create mode – sensible defaults
          isActive: false,
          duration: 10,
          description: "",
          name: "",
        },
  });

  // ---------------------------------------------------------------------------
  // Submit handler (create OR update)
  // ---------------------------------------------------------------------------
  const onSubmit = async (values: z.infer<typeof eventsFormSchema>) => {
    // Choose the correct server action
    const action =
      event == null ? createEvent : updateEvent.bind(null, event.id);

    // 🚀 No try/catch — let redirects bubble up
    await action(values);
  };

  // ---------------------------------------------------------------------------
  // Render JSX
  // ---------------------------------------------------------------------------
  return (
    <div className="lg:px-100 lg:py-10">
      {/* Form context provider – makes RHF APIs available to shadcn components */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-6 flex flex-col lg:gap-10">
          {/* -----------------------------------------------------------------*/}
          {/* Global error banner                                               */}
          {/* -----------------------------------------------------------------*/}
          {form.formState.errors.root && (
            <div className="text-red-500 text-sm">
              {form.formState.errors.root.message}
            </div>
          )}

          {/* -----------------------------------------------------------------*/}
          {/* Name                                                              */}
          {/* -----------------------------------------------------------------*/}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Event Name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* -----------------------------------------------------------------*/}
          {/* Duration                                                         */}
          {/* -----------------------------------------------------------------*/}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>In Minutes</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* -----------------------------------------------------------------*/}
          {/* Description                                                      */}
          {/* -----------------------------------------------------------------*/}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea className="h-32 resize-none" {...field} />
                </FormControl>
                <FormDescription>Event Description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* -----------------------------------------------------------------*/}
          {/* Active toggle                                                    */}
          {/* -----------------------------------------------------------------*/}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormDescription className="text-xs">
                  Event Status: inactive events will not be visible for users to
                  book.
                </FormDescription>
              </FormItem>
            )}
          />

          {/* ---------------------------------------------------------------------*/}
          {/* Action buttons (Delete | Cancel | Save)                              */}
          {/* ---------------------------------------------------------------------*/}
          <div className="flex gap-3 justify-end mt-8">
            {/* ---------------------------- DELETE -----------------------------*/}
            {event && (
              <AlertDialog>
                {/* 1. Red destructive button – opens the dialog */}
                <AlertDialogTrigger asChild>
                  <Button
                    className="cursor-pointer"
                    variant="destructive"
                    disabled={isDeletePending || form.formState.isSubmitting}>
                    Delete
                  </Button>
                </AlertDialogTrigger>

                {/* 2. Confirmation dialog */}
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete This Event?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action is irreversible. It will permanently delete
                      this event.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    {/* Cancel button – just closes the dialog */}
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    {/* Confirm delete */}
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600 cursor-pointer"
                      disabled={isDeletePending || form.formState.isSubmitting}
                      onClick={() => {
                        startDeleteTransition(async () => {
                          try {
                            await deleteEvent(event.id);
                          } catch (error: unknown) {
                            if (error instanceof Error) {
                              form.setError("root", {
                                message: `Error deleting event: ${error.message}`,
                              });
                            }
                            form.setError("root", {
                              message: "Unknown error deleting event",
                            });
                          }
                        });
                      }}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* ---------------------------- CANCEL -----------------------------*/}
            <Button
              type="button"
              variant="default"
              className="bg-gray-400 text-white hover:bg-gray-500"
              size="md"
              disabled={isDeletePending || form.formState.isSubmitting}>
              <Link href="/events">Cancel</Link>
            </Button>

            {/* ----------------------------- SAVE ------------------------------*/}
            <Button
              size="md"
              className="bg-blue-400 text-white hover:bg-blue-500 cursor-pointer"
              disabled={isDeletePending || form.formState.isSubmitting}
              type="submit">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventForm;
