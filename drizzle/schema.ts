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

// common columns
const createdAt = timestamp("createdAt").notNull().defaultNow();
const updatedAt = timestamp("updatedAt")
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

const scheduleDayOfWeekEnnum = pgEnum("dayOfWeek", [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

// events table
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

// schedule table
export const ScheduleTable = pgTable("schedule", {
  id: uuid("id").primaryKey().defaultRandom(),
  timezone: text("timezone").notNull(),
  clerkUserId: text("clerkUserId").notNull().unique(),
  createdAt,
  updatedAt,
});

// schedule-Availabilities table

export const ScheduleAvailabiltiesTable = pgTable(
  "scheduleAvailabilities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("scheduleId")
      .notNull()
      .references(() => ScheduleTable.id, { onDelete: "cascade" }),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    dayOfWeek: scheduleDayOfWeekEnnum("dayOfWeek").notNull(),
  },
  (table) => [index("scheduleIdIndex").on(table.scheduleId)]
);
