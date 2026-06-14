import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const plansTable = pgTable("plans", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  startDate: timestamp().notNull(),
  endDate: timestamp().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const exercisesTable = pgTable("exercises", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const workoutsTable = pgTable("workouts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  startedAt: timestamp().notNull(),
  completedAt: timestamp(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const workoutExercisesTable = pgTable("workout_exercises", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  workoutId: integer()
    .notNull()
    .references(() => workoutsTable.id, { onDelete: "cascade" }),
  exerciseId: integer()
    .notNull()
    .references(() => exercisesTable.id, { onDelete: "cascade" }),
  order: integer().notNull().default(0),
  createdAt: timestamp().notNull().defaultNow(),
});

export const setsTable = pgTable("sets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  workoutExerciseId: integer()
    .notNull()
    .references(() => workoutExercisesTable.id, { onDelete: "cascade" }),
  setNumber: integer().notNull(),
  weight: numeric({ precision: 6, scale: 2 }),
  reps: integer(),
  createdAt: timestamp().notNull().defaultNow(),
});
