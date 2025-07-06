import { z } from "zod";

export const eventsFormSchema = z.object({
  name: z.string().min(5, "Required"),
  description: z.string().optional(),
  isActive: z.boolean(),
  duration: z.coerce
    .number()
    .int()
    .positive("Duration must be greater that 0")
    .max(60 * 12, "Duration must be less than 12 hours"),
});
