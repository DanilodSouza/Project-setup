# Server Components

## params and searchParams MUST be awaited

In Next.js 15, `params` and `searchParams` are **Promises**. You must `await` them before accessing any property. Accessing them synchronously is a bug — it will either throw or return `undefined`.

```ts
// ✅ correct
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}

// ❌ wrong — params is a Promise, not a plain object
export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params; // undefined at runtime
}
```

The same rule applies to `searchParams`:

```ts
// ✅ correct
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
}
```

## Type signatures

Always type `params` and `searchParams` as `Promise<...>` in the function signature. Never type them as plain objects — that was the Next.js 14 API and it no longer applies.

| Prop | Type |
|---|---|
| `params` | `Promise<{ [segment]: string }>` |
| `searchParams` | `Promise<{ [key]: string \| string[] \| undefined }>` |

## All page components must be async

Server Components that receive `params` or `searchParams` must be declared `async` so the `await` is valid:

```ts
export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  // ...
}
```

## Data fetching in Server Components

- Fetch data **after** awaiting params — never before, since the query depends on the resolved value.
- All database calls go through helper functions in `/data` — no inline Drizzle queries in page files.
- Scope every query to the authenticated user's ID obtained from `auth()`, never from params.

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { workoutId } = await params;
  const id = parseInt(workoutId, 10);
  if (isNaN(id)) notFound();

  const workout = await getWorkoutById(userId, id);
  if (!workout) notFound();

  return <WorkoutForm workout={workout} />;
}
```
