# Data Fetching

## ONLY fetch data in Server Components

ALL data fetching in this app must be done inside **Server Components**. Do not fetch data in:

- Route handlers (`app/api/...`)
- Client components (`"use client"`)
- Any other mechanism

This is a hard rule with no exceptions. If a client component needs data, lift the fetch into its Server Component parent and pass the result down as props.

## ALWAYS use helper functions from `/data`

Database queries must NEVER be written inline in a component. Every query must live in a dedicated helper function inside the `/data` directory.

Rules for helper functions:

- Use **Drizzle ORM** exclusively — no raw SQL strings, no `db.execute()` with hand-written SQL
- Each function must accept a `userId` (or equivalent) and scope its query to that user's data only
- Export one function per logical operation (e.g. `getWorkoutsByUser`, `getExerciseById`)

## Data access is strictly per-user

A logged-in user must **only ever see their own data**. This is a security requirement, not a preference.

- Every query that returns user-owned data **must** filter by the authenticated user's ID
- Never fetch all rows and filter in JavaScript — filter at the database level via Drizzle's `.where()` clause
- Never accept a `userId` from query params, request bodies, or any client-supplied input — always derive it from the verified server-side session

Violating this rule creates an insecure direct object reference (IDOR) vulnerability.
