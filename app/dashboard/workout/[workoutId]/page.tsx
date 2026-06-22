import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getWorkoutById } from "@/data/workouts";
import EditWorkoutForm from "./EditWorkoutForm";

interface Props {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { workoutId } = await params;
  const id = parseInt(workoutId, 10);
  if (isNaN(id)) notFound();

  const workout = await getWorkoutById(userId, id);
  if (!workout) notFound();

  return (
    <main className="flex-1 p-6 max-w-lg mx-auto w-full">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
        Edit Workout
      </h1>
      <EditWorkoutForm workout={workout} />
    </main>
  );
}
