# Authentication

## This app uses Clerk

All authentication is handled by **Clerk** (`@clerk/nextjs`). Do not implement custom auth, sessions, JWTs, or any other authentication mechanism. Clerk is the only auth provider.

## Getting the current user on the server

Use Clerk's `auth()` helper from `@clerk/nextjs/server` inside Server Components, Server Actions, and Route Handlers:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
```

- `userId` is `null` when the user is not signed in
- Always check for `null` and redirect or throw before proceeding
- Never pass `userId` from the client — always derive it server-side from `auth()`

## Protecting pages

Redirect unauthenticated users inside the Server Component or Server Action — do not rely solely on middleware for page-level protection:

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const { userId } = await auth();
if (!userId) redirect("/sign-in");
```

## Protecting Server Actions

Every Server Action that touches user data must call `auth()` at the top and reject if there is no session:

```ts
import { auth } from "@clerk/nextjs/server";

export async function deleteWorkout(workoutId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  // ...
}
```

## UI components

Use Clerk's pre-built components for all auth-related UI. Never build custom sign-in/sign-up forms:

- `<SignInButton />` — triggers Clerk's sign-in flow
- `<SignUpButton />` — triggers Clerk's sign-up flow
- `<UserButton />` — user avatar + account menu
- `<Show when="signed-in">` / `<Show when="signed-out">` — conditional rendering based on auth state

These are already wired up in `app/layout.tsx`. Do not duplicate or replace them.

## What NOT to do

- Do not read cookies or headers manually to determine auth state
- Do not accept a `userId` from query params, request bodies, or any client-supplied source
- Do not store the Clerk user ID in a separate session table — use it directly from `auth()`
- Do not use `currentUser()` when only the ID is needed — `auth()` is faster (no extra network call)
