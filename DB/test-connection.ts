import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import {
  plansTable,
  exercisesTable,
  workoutsTable,
  workoutExercisesTable,
  setsTable,
} from "./Schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const USER_ID = "user_3F6WHz9lHRgj4UwjAikU2pQE3Hg";

async function test() {
  console.log("=== CONNECTION TEST ===");
  console.log(`=== USER: ${USER_ID} ===\n`);

  // 1. Plans scoped to user
  const plans = await db.select().from(plansTable).where(eq(plansTable.userId, USER_ID));
  console.log(`PLANS (${plans.length} rows):`);
  plans.forEach((p) =>
    console.log(`  [${p.id}] ${p.name} | ${p.startDate.toDateString()} → ${p.endDate.toDateString()}`)
  );

  // 2. Exercises (global library)
  const exercises = await db.select().from(exercisesTable);
  console.log(`\nEXERCISES (${exercises.length} rows — shared library):`);
  exercises.forEach((e) => console.log(`  [${e.id}] ${e.name}`));

  // 3. Workouts scoped to user
  const workouts = await db.select().from(workoutsTable).where(eq(workoutsTable.userId, USER_ID));
  console.log(`\nWORKOUTS (${workouts.length} rows):`);
  workouts.forEach((w) =>
    console.log(`  [${w.id}] ${w.name} | started: ${w.startedAt.toDateString()} | completed: ${w.completedAt?.toDateString() ?? "in progress"}`)
  );

  // 4. Full relational join: workout → exercises → sets
  console.log("\n=== RELATIONAL STRUCTURE ===");
  for (const workout of workouts) {
    console.log(`\nWORKOUT [${workout.id}]: ${workout.name}`);

    const wes = await db
      .select()
      .from(workoutExercisesTable)
      .where(eq(workoutExercisesTable.workoutId, workout.id));

    for (const we of wes) {
      const exercise = exercises.find((e) => e.id === we.exerciseId)!;
      const sets = await db
        .select()
        .from(setsTable)
        .where(eq(setsTable.workoutExerciseId, we.id));

      console.log(`  └─ [${exercise.name}] (workout_exercise id: ${we.id}, order: ${we.order})`);
      sets.forEach((s) =>
        console.log(`       Set ${s.setNumber}: ${s.weight} kg × ${s.reps} reps`)
      );
    }
  }

  console.log("\n=== ALL CHECKS PASSED ✓ ===");
}

test().catch((err) => {
  console.error("CONNECTION FAILED:", err);
  process.exit(1);
});
