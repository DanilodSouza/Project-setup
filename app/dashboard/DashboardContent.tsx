"use client";

import { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import DatePicker from "./DatePicker";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SetData = {
  setNumber: number;
  weight: string | null;
  reps: number | null;
};

type ExerciseData = {
  id: number;
  name: string;
  sets: SetData[];
};

type WorkoutData = {
  id: number;
  name: string;
  date: Date;
  startedAt: Date;
  completedAt: Date | null;
  exercises: ExerciseData[];
};

const MOCK_WORKOUTS: WorkoutData[] = [
  {
    id: 1,
    name: "Upper Body A",
    date: new Date(2026, 5, 15),
    startedAt: new Date(2026, 5, 15, 8, 0),
    completedAt: new Date(2026, 5, 15, 9, 15),
    exercises: [
      {
        id: 1,
        name: "Bench Press",
        sets: [
          { setNumber: 1, weight: "80", reps: 8 },
          { setNumber: 2, weight: "80", reps: 8 },
          { setNumber: 3, weight: "77.5", reps: 9 },
        ],
      },
      {
        id: 2,
        name: "Barbell Row",
        sets: [
          { setNumber: 1, weight: "70", reps: 10 },
          { setNumber: 2, weight: "70", reps: 10 },
          { setNumber: 3, weight: "70", reps: 9 },
        ],
      },
      {
        id: 3,
        name: "Overhead Press",
        sets: [
          { setNumber: 1, weight: "50", reps: 8 },
          { setNumber: 2, weight: "50", reps: 7 },
          { setNumber: 3, weight: "47.5", reps: 8 },
        ],
      },
    ],
  },
];

export default function DashboardContent() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  const workouts = selectedDate
    ? MOCK_WORKOUTS.filter((w) => isSameDay(w.date, selectedDate))
    : [];

  return (
    <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>
        {selectedDate && (
          <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
        )}
      </div>

      {workouts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400 dark:text-zinc-500">
          <p className="text-lg">No workouts logged for this date.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {workouts.map((workout) => (
            <Card
              key={workout.id}
              className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {workout.name}
                  </CardTitle>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 text-right">
                    <p>Started {format(workout.startedAt, "h:mm a")}</p>
                    {workout.completedAt && (
                      <p>Finished {format(workout.completedAt, "h:mm a")}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {workout.exercises.length === 0 ? (
                  <p className="text-sm text-zinc-400">No exercises recorded.</p>
                ) : (
                  <div className="space-y-5">
                    {workout.exercises.map((exercise) => (
                      <div key={exercise.id}>
                        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                          {exercise.name}
                        </h3>
                        {exercise.sets.length === 0 ? (
                          <p className="text-xs text-zinc-400">
                            No sets recorded.
                          </p>
                        ) : (
                          <table className="w-full text-sm font-mono">
                            <thead>
                              <tr className="text-left text-xs text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-800">
                                <th className="pb-1 font-medium">Set</th>
                                <th className="pb-1 font-medium">Weight</th>
                                <th className="pb-1 font-medium">Reps</th>
                              </tr>
                            </thead>
                            <tbody>
                              {exercise.sets.map((set) => (
                                <tr
                                  key={set.setNumber}
                                  className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0"
                                >
                                  <td className="py-1.5 text-zinc-500 dark:text-zinc-400">
                                    {set.setNumber}
                                  </td>
                                  <td className="py-1.5 text-zinc-900 dark:text-zinc-100 font-medium">
                                    {set.weight != null
                                      ? `${set.weight} kg`
                                      : "—"}
                                  </td>
                                  <td className="py-1.5 text-zinc-900 dark:text-zinc-100">
                                    {set.reps != null ? set.reps : "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
