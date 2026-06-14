import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import {
  setsTable,
  workoutExercisesTable,
  workoutsTable,
  plansTable,
  exercisesTable,
} from "./Schema";

const db = drizzle(neon(process.env.DATABASE_URL!));

async function clear() {
  await db.delete(setsTable);
  await db.delete(workoutExercisesTable);
  await db.delete(workoutsTable);
  await db.delete(plansTable);
  await db.delete(exercisesTable);
  console.log("All tables cleared");
}

clear().catch(console.error);
