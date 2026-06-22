import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import {
  plansTable,
  exercisesTable,
  workoutsTable,
  workoutExercisesTable,
  setsTable,
} from "./Schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const USER_ID = process.argv[2] ?? "user_3F6WHz9lHRgj4UwjAikU2pQE3Hg";
if (!process.argv[2]) {
  console.warn("⚠ No user ID passed — using default. Pass your Clerk user ID: npx tsx DB/seed.ts <your_user_id>");
}

async function seed() {
  console.log("Seeding database...");

  const [plan] = await db
    .insert(plansTable)
    .values({
      userId: USER_ID,
      name: "Strength Builder 12-Week",
      description: "A 12-week program focused on building raw strength across the main lifts.",
      startDate: new Date("2026-06-01"),
      endDate: new Date("2026-08-24"),
    })
    .returning();
  console.log("Created plan:", plan.id);

  const exercises = await db
    .insert(exercisesTable)
    .values([
      { name: "Barbell Back Squat" },
      { name: "Bench Press" },
      { name: "Deadlift" },
      { name: "Overhead Press" },
      { name: "Barbell Row" },
    ])
    .returning();
  console.log("Created exercises:", exercises.map((e) => e.id));

  const [squat, bench, deadlift, ohp, row] = exercises;

  const workouts = await db
    .insert(workoutsTable)
    .values([
      {
        userId: USER_ID,
        name: "Day 1 - Lower",
        startedAt: new Date("2026-06-02T09:00:00"),
        completedAt: new Date("2026-06-02T10:15:00"),
      },
      {
        userId: USER_ID,
        name: "Day 2 - Upper",
        startedAt: new Date("2026-06-04T08:30:00"),
        completedAt: new Date("2026-06-04T09:45:00"),
      },
      {
        userId: USER_ID,
        name: "Day 3 - Full Body",
        startedAt: new Date("2026-06-06T10:00:00"),
        completedAt: new Date("2026-06-06T11:30:00"),
      },
    ])
    .returning();
  console.log("Created workouts:", workouts.map((w) => w.id));

  const [lower, upper, fullBody] = workouts;

  const workoutExercises = await db
    .insert(workoutExercisesTable)
    .values([
      { workoutId: lower.id, exerciseId: squat.id, order: 1 },
      { workoutId: lower.id, exerciseId: deadlift.id, order: 2 },
      { workoutId: upper.id, exerciseId: bench.id, order: 1 },
      { workoutId: upper.id, exerciseId: ohp.id, order: 2 },
      { workoutId: upper.id, exerciseId: row.id, order: 3 },
      { workoutId: fullBody.id, exerciseId: squat.id, order: 1 },
      { workoutId: fullBody.id, exerciseId: bench.id, order: 2 },
      { workoutId: fullBody.id, exerciseId: deadlift.id, order: 3 },
    ])
    .returning();
  console.log("Created workout_exercises:", workoutExercises.map((we) => we.id));

  const [weSq1, weDl1, weBe2, weOhp2, weRow2, weSq3, weBe3, weDl3] = workoutExercises;

  await db.insert(setsTable).values([
    // Day 1 Squats
    { workoutExerciseId: weSq1.id, setNumber: 1, weight: "100.00", reps: 5 },
    { workoutExerciseId: weSq1.id, setNumber: 2, weight: "100.00", reps: 5 },
    { workoutExerciseId: weSq1.id, setNumber: 3, weight: "100.00", reps: 5 },
    // Day 1 Deadlifts
    { workoutExerciseId: weDl1.id, setNumber: 1, weight: "140.00", reps: 5 },
    { workoutExerciseId: weDl1.id, setNumber: 2, weight: "140.00", reps: 5 },
    { workoutExerciseId: weDl1.id, setNumber: 3, weight: "140.00", reps: 3 },
    // Day 2 Bench
    { workoutExerciseId: weBe2.id, setNumber: 1, weight: "80.00", reps: 5 },
    { workoutExerciseId: weBe2.id, setNumber: 2, weight: "80.00", reps: 5 },
    { workoutExerciseId: weBe2.id, setNumber: 3, weight: "80.00", reps: 4 },
    // Day 2 OHP
    { workoutExerciseId: weOhp2.id, setNumber: 1, weight: "50.00", reps: 8 },
    { workoutExerciseId: weOhp2.id, setNumber: 2, weight: "50.00", reps: 7 },
    { workoutExerciseId: weOhp2.id, setNumber: 3, weight: "50.00", reps: 6 },
    // Day 2 Row
    { workoutExerciseId: weRow2.id, setNumber: 1, weight: "70.00", reps: 8 },
    { workoutExerciseId: weRow2.id, setNumber: 2, weight: "70.00", reps: 8 },
    { workoutExerciseId: weRow2.id, setNumber: 3, weight: "70.00", reps: 7 },
    // Day 3 Squat
    { workoutExerciseId: weSq3.id, setNumber: 1, weight: "105.00", reps: 5 },
    { workoutExerciseId: weSq3.id, setNumber: 2, weight: "105.00", reps: 5 },
    { workoutExerciseId: weSq3.id, setNumber: 3, weight: "105.00", reps: 5 },
    // Day 3 Bench
    { workoutExerciseId: weBe3.id, setNumber: 1, weight: "82.50", reps: 5 },
    { workoutExerciseId: weBe3.id, setNumber: 2, weight: "82.50", reps: 5 },
    { workoutExerciseId: weBe3.id, setNumber: 3, weight: "82.50", reps: 4 },
    // Day 3 Deadlift
    { workoutExerciseId: weDl3.id, setNumber: 1, weight: "142.50", reps: 5 },
    { workoutExerciseId: weDl3.id, setNumber: 2, weight: "142.50", reps: 5 },
    { workoutExerciseId: weDl3.id, setNumber: 3, weight: "142.50", reps: 5 },
  ]);
  console.log("Created sets");

  console.log("Done!");
}

seed().catch(console.error);
