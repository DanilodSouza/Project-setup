# Data Mutations

## ALL mutations go through Server Actions

Every write operation (create, update, delete) must be implemented as a **Server Action**. Do not mutate data via:

- Route handlers (`app/api/...`)
- Client-side `fetch` calls
- Any other mechanism

Server Actions are the only permitted mutation path.

## ALWAYS use helper functions from `/data`

Server Actions must not write Drizzle queries inline. Every database call must be extracted into a dedicated helper function inside the `/data` directory.

Rules for helper functions:

- Use **Drizzle ORM** exclusively — no raw SQL strings, no `db.execute()` with hand-written SQL
- One function per logical operation (e.g. `createWorkout`, `deleteSet`, `updateExercise`)
- The Server Action calls the helper; the helper owns the query

## Server Action typing rules

- Parameters must be **explicitly typed** with TypeScript types or interfaces
- **Never use `FormData` as a parameter type** — parse and validate inputs before they reach the action
- Actions should accept plain typed objects, not raw form primitives

```ts
// ✅ correct
export async function createWorkout(input: CreateWorkoutInput) { ... }

// ❌ wrong
export async function createWorkout(formData: FormData) { ... }
```

## ALL Server Actions must validate inputs with Zod

Every Server Action must validate its arguments with a **Zod schema** before doing anything else — before calling helpers, before touching the database.

```ts
import { z } from "zod";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1).max(255),
  startedAt: z.date(),
});

export async function createWorkout(input: unknown) {
  const parsed = CreateWorkoutSchema.parse(input); // throws on invalid input
  await insertWorkout(parsed);
}
```

- Use `.parse()` (throws) or `.safeParse()` (returns result object) — never skip validation
- Define schemas alongside their actions or in a co-located `schema.ts` file
- Never trust caller-supplied data, even from your own client components
