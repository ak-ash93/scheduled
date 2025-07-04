"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { eventsFormSchema } from "../../../schema/events";
import { zodResolver } from "@hookform/resolvers/zod";
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

const EventForm = ({
  event,
}: {
  event?: {
    id: string;
    name: string;
    description?: string;
    durationInMin: number;
    isActive: boolean;
  };
}) => {
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const form = useForm<z.infer<typeof eventsFormSchema>>({
    resolver: zodResolver(eventsFormSchema),
    defaultValues: event
      ? {
          ...event,
        }
      : {
          isActive: true,
          durationInMin: 30,
          description: "",
          name: "",
        },
  });

  const onSubmit = async (values: z.infer<typeof eventsFormSchema>) => {
    const action =
      event == null ? createEvent : updateEvent.bind(null, event.id);

    try {
      await action(values);
    } catch (error: any) {
      form.setError("root", {
        message: `There was an error saving your event ${error.message}`,
      });
    }
  };

  return (
    <div className="lg:px-100 lg:py-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-6 flex flex-col lg:gap-10">
          {/* root error handling  */}
          {form.formState.errors.root && (
            <div className="text-red-500 yext-sm">
              {form.formState.errors.root.message}
            </div>
          )}

          {/* Name field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription> Event Name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time Duration field */}
          <FormField
            control={form.control}
            name="durationInMin"
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

          {/* Description field */}
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

          {/* Toggle Active field */}
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
                  Event Status: InActive events will not be visible for users to
                  book
                </FormDescription>
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="flex gap-3 justify-end mt-8">
        {/* delete button */}
        {event && (
          <AlertDialog>
            {/* delete button */}
            <AlertDialogTrigger asChild>
              <Button
                variant={"destructive"}
                disabled={isDeletePending || form.formState.isSubmitting}>
                Delete
              </Button>
            </AlertDialogTrigger>

            {/* alert pop up */}
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete This Event ?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action is irreversible.It will permanently delete this
                  event
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                {/* popup cancel button */}
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                {/* popup delete button */}
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600 cursor-pointer"
                  disabled={isDeletePending || form.formState.isSubmitting}
                  onClick={() => {
                    startDeleteTransition(async () => {
                      try {
                        await deleteEvent(event.id);
                      } catch (error: any) {
                        form.setError("root", {
                          message: `Error deleting event: ${error.message}`,
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
        {/* cancel button */}
        <Button
          disabled={isDeletePending || form.formState.isSubmitting}
          type="button"
          variant={"default"}
          className="bg-gray-400 text-white hover:bg-gray-500 cursor-pointer"
          size={"md"}>
          {" "}
          <Link href="/events">Cancel</Link>
        </Button>
        <Button
          disabled={isDeletePending || form.formState.isSubmitting}
          size={"md"}
          className="bg-blue-400 text-white hover:bg-blue-500 cursor-pointer">
          Save
        </Button>
      </div>
    </div>
  );
};

export default EventForm;
