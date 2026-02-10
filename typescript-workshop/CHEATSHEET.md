# TypeScript Cheatsheet

## Basic Types

```ts
let name: string = "Alice";
let age: number = 30;
let active: boolean = true;
let scores: number[] = [90, 85];
let anything: unknown = "safer than any";
```

## Functions

```ts
function greet(name: string): string {
  return `Hello, ${name}`;
}

const add = (a: number, b: number): number => a + b;

function log(msg: string): void { console.log(msg); }

function buy(item: string, qty?: number): void {}   // optional
function tax(price: number, rate = 0.1): number {}   // default
```

## Interface vs Type

```ts
// Interface → objects & classes (can extend & merge)
interface User {
  id: number;
  name: string;
  email?: string;          // optional
}
interface Admin extends User {
  role: string;
}

// Type → unions, intersections, aliases
type ID = string | number;
type Status = "active" | "inactive";
type Contact = HasName & HasEmail;
```

## Unions & Intersections

```ts
type Result = string | number;       // union: one OR the other
type Named = { name: string } & { age: number };  // intersection: BOTH
```

## Generics

```ts
function first<T>(arr: T[]): T { return arr[0]; }

first([1, 2, 3]);        // T = number
first(["a", "b"]);       // T = string

interface ApiResponse<T> { data: T; ok: boolean; }

// Constraint: T must have .length
function logLen<T extends { length: number }>(x: T) { console.log(x.length); }
```

## Async & Promises

```ts
// Promise<T> is a generic — always type your async return values
async function fetchUser(id: number): Promise<User> {
  return { id, name: "Alice" };
}

// Generic async function
async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  return res.json();
}

// Promise.all preserves individual types
const [user, scores] = await Promise.all([
  fetchUser(1),              // Promise<User>
  Promise.resolve([95, 87]), // Promise<number[]>
]);
```

## Utility Types

```ts
Partial<User>            // all fields optional
Required<User>           // all fields required
Readonly<User>           // all fields readonly
Pick<User, "id" | "name">   // keep only these fields
Omit<User, "password">      // remove these fields
Record<string, number>       // { [key: string]: number }
```

Common combo:

```ts
type CreateDTO = Omit<User, "id">;              // no id for creation
type UpdateDTO = Partial<Omit<User, "id">>;     // optional fields for update
```

## Type Guards

```ts
typeof x === "string"         // primitives
x instanceof Date             // classes
"swim" in animal              // property check

// Custom guard
function isAdmin(u: User | Admin): u is Admin {
  return "role" in u;
}
```

## Error Handling

```ts
// catch variable is `unknown` — must narrow before using
try {
  JSON.parse(input);
} catch (err: unknown) {
  if (err instanceof Error) console.log(err.message);
}

// Helper: safely extract error message
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Unknown error";
}

// Custom Error classes for structured error handling
class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
  }
}

function handleError(err: unknown) {
  if (err instanceof ValidationError) return err.field; // narrowed
}
```

## Literal Types & Enums

```ts
type Dir = "up" | "down" | "left" | "right";    // string literals
type Dice = 1 | 2 | 3 | 4 | 5 | 6;             // number literals

enum LogLevel { Debug = "DEBUG", Info = "INFO", Error = "ERROR" }

const ROLES = ["admin", "editor", "viewer"] as const;
type Role = (typeof ROLES)[number];   // "admin" | "editor" | "viewer"
```

## Discriminated Unions

```ts
type State =
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; error: string };

function handle(s: State) {
  switch (s.status) {
    case "loading": return "Loading...";
    case "success": return s.data;
    case "error":   return s.error;
  }
}
```

## Quick Tips

| Do ✅ | Don't ❌ |
|-------|---------|
| Let TS infer variable types | Use `any` |
| Be explicit with function signatures | Ignore red squiggles |
| Use discriminated unions for state | Use optional booleans for state |
| Combine utility types for DTOs | Duplicate types manually |
| Hover in VS Code to learn types | Over-annotate obvious things |