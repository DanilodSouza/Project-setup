import { and, eq, gte, lt } from "drizzle-orm";
import { DB } from "@/DB/index";
import {
  workoutsTable,
  workoutExercisesTable,
  exercisesTable,
  setsTable,
} from "@/DB/Schema";

export type SetData = {
  setNumber: number;
  weight: string | null;
  reps: number | null;
};

export type ExerciseData = {
  id: number;
  name: string;
  sets: SetData[];
};

export type WorkoutData = {
  id: number;
  name: string;
  startedAt: Date;
  completedAt: Date | null;
  exercises: ExerciseData[];
};

export async function getWorkoutsForDate(
  userId: string,
  date: Date
): Promise<WorkoutData[]> {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const rows = await DB.select({
    workoutId: workoutsTable.id,
    workoutName: workoutsTable.name,
    startedAt: workoutsTable.startedAt,
    completedAt: workoutsTable.completedAt,
    workoutExerciseId: workoutExercisesTable.id,
    exerciseId: exercisesTable.id,
    exerciseName: exercisesTable.name,
    exerciseOrder: workoutExercisesTable.order,
    setNumber: setsTable.setNumber,
    weight: setsTable.weight,
    reps: setsTable.reps,
  })
    .from(workoutsTable)
    .where(
      and(
        eq(workoutsTable.userId, userId),
        gte(workoutsTable.startedAt, start),
        lt(workoutsTable.startedAt, end)
      )
    )
    .leftJoin(
      workoutExercisesTable,
      eq(workoutExercisesTable.workoutId, workoutsTable.id)
    )
    .leftJoin(
      exercisesTable,
      eq(exercisesTable.id, workoutExercisesTable.exerciseId)
    )
    .leftJoin(
      setsTable,
      eq(setsTable.workoutExerciseId, workoutExercisesTable.id)
    )
    .orderBy(
      workoutsTable.startedAt,
      workoutExercisesTable.order,
      setsTable.setNumber
    );

  const workoutsMap = new Map<number, WorkoutData>();

  for (const row of rows) {
    if (!workoutsMap.has(row.workoutId)) {
      workoutsMap.set(row.workoutId, {
        id: row.workoutId,
        name: row.workoutName,
        startedAt: row.startedAt,
        completedAt: row.completedAt,
        exercises: [],
      });
    }

    const workout = workoutsMap.get(row.workoutId)!;

    if (row.workoutExerciseId != null && row.exerciseId != null) {
      let exercise = workout.exercises.find(
        (e) => e.id === row.workoutExerciseId
      );
      if (!exercise) {
        exercise = {
          id: row.workoutExerciseId,
          name: row.exerciseName!,
          sets: [],
        };
        workout.exercises.push(exercise);
      }

      if (row.setNumber != null) {
        exercise.sets.push({
          setNumber: row.setNumber,
          weight: row.weight ?? null,
          reps: row.reps ?? null,
        });
      }
    }
  }

  return Array.from(workoutsMap.values());
}

export async function insertWorkout(input: {
  userId: string;
  name: string;
  startedAt: Date;
}) {
  const [workout] = await DB.insert(workoutsTable).values(input).returning();
  return workout;
}

export async function getWorkoutById(
  userId: string,
  workoutId: number
): Promise<WorkoutData | null> {
  const rows = await DB.select({
    workoutId: workoutsTable.id,
    workoutName: workoutsTable.name,
    startedAt: workoutsTable.startedAt,
    completedAt: workoutsTable.completedAt,
    workoutExerciseId: workoutExercisesTable.id,
    exerciseId: exercisesTable.id,
    exerciseName: exercisesTable.name,
    exerciseOrder: workoutExercisesTable.order,
    setNumber: setsTable.setNumber,
    weight: setsTable.weight,
    reps: setsTable.reps,
  })
    .from(workoutsTable)
    .where(and(eq(workoutsTable.userId, userId), eq(workoutsTable.id, workoutId)))
    .leftJoin(
      workoutExercisesTable,
      eq(workoutExercisesTable.workoutId, workoutsTable.id)
    )
    .leftJoin(
      exercisesTable,
      eq(exercisesTable.id, workoutExercisesTable.exerciseId)
    )
    .leftJoin(
      setsTable,
      eq(setsTable.workoutExerciseId, workoutExercisesTable.id)
    )
    .orderBy(workoutExercisesTable.order, setsTable.setNumber);

  if (rows.length === 0) return null;

  const first = rows[0];
  const workout: WorkoutData = {
    id: first.workoutId,
    name: first.workoutName,
    startedAt: first.startedAt,
    completedAt: first.completedAt,
    exercises: [],
  };

  for (const row of rows) {
    if (row.workoutExerciseId != null && row.exerciseId != null) {
      let exercise = workout.exercises.find((e) => e.id === row.workoutExerciseId);
      if (!exercise) {
        exercise = { id: row.workoutExerciseId, name: row.exerciseName!, sets: [] };
        workout.exercises.push(exercise);
      }
      if (row.setNumber != null) {
        exercise.sets.push({
          setNumber: row.setNumber,
          weight: row.weight ?? null,
          reps: row.reps ?? null,
        });
      }
    }
  }

  return workout;
}

export async function updateWorkoutById(
  userId: string,
  workoutId: number,
  input: { name: string; startedAt: Date }
) {
  const [updated] = await DB.update(workoutsTable)
    .set({ name: input.name, startedAt: input.startedAt, updatedAt: new Date() })
    .where(and(eq(workoutsTable.userId, userId), eq(workoutsTable.id, workoutId)))
    .returning();
  return updated ?? null;
}
