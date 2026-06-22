"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { insertWorkout, updateWorkoutById } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1).max(255),
  startedAt: z.date(),
});

export async function createWorkout(input: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = CreateWorkoutSchema.parse(input);
  await insertWorkout({ userId, ...parsed });
}

const UpdateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().min(1).max(255),
  startedAt: z.date(),
});

export async function updateWorkout(input: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { workoutId, name, startedAt } = UpdateWorkoutSchema.parse(input);
  const result = await updateWorkoutById(userId, workoutId, { name, startedAt });
  if (!result) throw new Error("Workout not found");
}
