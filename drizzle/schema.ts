import { relations } from "drizzle-orm";
import { dayOfWeek } from "./index";

import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/*  1. COMMON COLUMNS                                                 */
/* ------------------------------------------------------------------ */

const createdAt = timestamp("createdAt").notNull().defaultNow();
const updatedAt = timestamp("updatedAt")
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

/* ------------------------------------------------------------------ */
/*  2. ENUM must come *before* any tables that use it                 */
/* ------------------------------------------------------------------ */

export const scheduleDayOfWeekEnum = pgEnum("dayOfWeek", dayOfWeek);

/* ------------------------------------------------------------------ */
/*  3. TABLES                                                         */
/* ------------------------------------------------------------------ */

// 3‑a. Events
export const EventsTable = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    duration: integer("duration").notNull(),
    clerkUserId: text("clerkUserId").notNull().unique(),
    isActive: boolean("isActive").notNull().default(true),
    createdAt,
    updatedAt,
  },
  (table) => [index("clerkUserIdIndex").on(table.clerkUserId)]
);

// 3‑b. Schedule (one row per user)
export const ScheduleTable = pgTable("schedule", {
  id: uuid("id").primaryKey().defaultRandom(),
  timezone: text("timezone").notNull(),
  clerkUserId: text("clerkUserId").notNull().unique(),
  createdAt,
  updatedAt,
});

// 3‑c. ScheduleAvailabilities (many rows per schedule)
export const ScheduleAvailabilitiesTable = pgTable(
  "scheduleAvailabilities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("scheduleId")
      .notNull()
      .references(() => ScheduleTable.id, { onDelete: "cascade" }),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(),
  },
  (table) => [index("scheduleIdIndex").on(table.scheduleId)]
);

/* ------------------------------------------------------------------ */
/*  4. RELATIONS                                                      */
/* ------------------------------------------------------------------ */

// Schedule 1 ───▶ ∞ ScheduleAvailabilities
export const ScheduleRelations = relations(ScheduleTable, ({ many }) => ({
  availabilities: many(ScheduleAvailabilitiesTable),
}));

// ScheduleAvailabilities ∞ ───▶ 1 Schedule
export const ScheduleAvailabilityRelations = relations(
  ScheduleAvailabilitiesTable,
  ({ one }) => ({
    schedule: one(ScheduleTable, {
      fields: [ScheduleAvailabilitiesTable.scheduleId],
      references: [ScheduleTable.id],
    }),
  })
);
