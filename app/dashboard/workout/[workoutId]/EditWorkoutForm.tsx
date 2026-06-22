"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { updateWorkout } from "@/actions/workouts";
import type { WorkoutData } from "@/data/workouts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function toDateInputValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function toTimeInputValue(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

interface Props {
  workout: WorkoutData;
}

export default function EditWorkoutForm({ workout }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(workout.name);
  const [date, setDate] = useState(() => toDateInputValue(workout.startedAt));
  const [time, setTime] = useState(() => toTimeInputValue(workout.startedAt));
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const [hours, minutes] = time.split(":").map(Number);
    const startedAt = parseISO(date);
    startedAt.setHours(hours, minutes, 0, 0);

    startTransition(async () => {
      try {
        await updateWorkout({ workoutId: workout.id, name, startedAt });
        router.push("/dashboard");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Workout Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-zinc-700 dark:text-zinc-300">
              Workout Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Day 1 – Upper Body"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="date" className="text-zinc-700 dark:text-zinc-300">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={isPending}
            />
            {date && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {format(parseISO(date), "do MMM yyyy")}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="time" className="text-zinc-700 dark:text-zinc-300">
              Start Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              disabled={isPending}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
