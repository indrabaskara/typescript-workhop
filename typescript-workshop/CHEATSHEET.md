# TypeScript Quick Reference Cheat Sheet

## Basic Types

```typescript
// Primitives
let name: string = "John";
let age: number = 25;
let active: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["a", "b"];

// Objects
let user: { name: string; age: number } = {
  name: "John",
  age: 25
};

// Functions
function greet(name: string): string {
  return `Hello ${name}`;
}

const add = (a: number, b: number): number => a + b;

// Any, Unknown, Never
let anything: any = "hello";           // Avoid!
let userInput: unknown = "data";       // Safer than any
function throwError(): never { throw new Error(); }
```

## Interfaces vs Types

```typescript
// Interface - for objects, can extend
interface User {
  id: number;
  name: string;
}

interface Admin extends User {
  role: string;
}

// Type - for unions, intersections
type ID = string | number;
type Result = { success: true; data: any } | { success: false; error: string };

// Both work for objects
interface IUser { name: string; }
type TUser = { name: string; };
```

## Unions & Intersections

```typescript
// Union (OR) - can be one of several types
type Status = "pending" | "approved" | "rejected";
type StringOrNumber = string | number;

// Intersection (AND) - combines types
type HasId = { id: number };
type HasName = { name: string };
type User = HasId & HasName;  // Has both id and name
```

## Generics

```typescript
// Generic function
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
}

// Generic class
class DataStore<T> {
  private data: T[] = [];
  add(item: T): void { this.data.push(item); }
  getAll(): T[] { return this.data; }
}

// With constraints
function merge<T extends object>(obj1: T, obj2: T): T {
  return { ...obj1, ...obj2 };
}
```

## Utility Types

```typescript
// Partial - make all optional
type PartialUser = Partial<User>;

// Required - make all required
type RequiredConfig = Required<Config>;

// Readonly - make all readonly
type ReadonlyUser = Readonly<User>;

// Pick - select properties
type UserName = Pick<User, "id" | "name">;

// Omit - exclude properties
type UserNoPassword = Omit<User, "password">;

// Record - create object type
type Roles = Record<"admin" | "user", string[]>;

// ReturnType - get function return type
type Result = ReturnType<typeof myFunction>;

// Awaited - unwrap Promise
type Data = Awaited<Promise<User>>;
```

## Type Guards

```typescript
// typeof
if (typeof value === "string") {
  value.toUpperCase(); // value is string
}

// instanceof
if (animal instanceof Dog) {
  animal.bark(); // animal is Dog
}

// Custom type guard
function isUser(obj: any): obj is User {
  return "id" in obj && "name" in obj;
}

// in operator
if ("swim" in animal) {
  animal.swim();
}
```

## Literal Types

```typescript
// String literals
type Direction = "north" | "south" | "east" | "west";

// Number literals
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

// Template literals
type Greeting = `Hello ${string}`;
type EventHandler = `on${Capitalize<"click" | "scroll">}`;

// as const
const colors = { primary: "blue", secondary: "green" } as const;
type Color = typeof colors[keyof typeof colors]; // "blue" | "green"
```

## Enums

```typescript
// Numeric enum
enum Role {
  Admin = 1,
  User = 2,
  Guest = 3
}

// String enum
enum Status {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED"
}

// Usage
let userRole: Role = Role.Admin;
let status: Status = Status.Pending;
```

## Discriminated Unions

```typescript
interface Loading {
  type: "loading";
}

interface Success {
  type: "success";
  data: string;
}

interface Error {
  type: "error";
  error: string;
}

type State = Loading | Success | Error;

function handle(state: State) {
  switch (state.type) {
    case "loading":
      return "Loading...";
    case "success":
      return state.data;
    case "error":
      return state.error;
  }
}
```

## Conditional Types

```typescript
// Basic conditional
type IsString<T> = T extends string ? true : false;

// With infer
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Distributive
type ToArray<T> = T extends any ? T[] : never;
type Result = ToArray<string | number>; // string[] | number[]
```

## Advanced Patterns

```typescript
// Mapped types
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

// Conditional mapped types
type OptionalFunctions<T> = {
  [K in keyof T]: T[K] extends Function ? T[K] | undefined : T[K];
};

// Deep readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object 
    ? DeepReadonly<T[K]> 
    : T[K];
};

// Builder pattern
class QueryBuilder<T> {
  where(fn: (item: T) => boolean): this {
    return this;
  }
  sortBy(fn: (a: T, b: T) => number): this {
    return this;
  }
}
```

## Tips & Best Practices

### DO ✅
- Let TypeScript infer types when obvious
- Use `interface` for object shapes
- Use `type` for unions/intersections
- Use strict mode (`"strict": true` in tsconfig.json)
- Use `unknown` instead of `any` when type is truly unknown
- Use discriminated unions for state management
- Leverage utility types to reduce boilerplate

### DON'T ❌
- Don't overuse `any` (disables type checking)
- Don't use `as` type assertions unless necessary
- Don't repeat yourself - use generics and utility types
- Don't ignore TypeScript errors
- Don't use `!` non-null assertion without being certain

## Common Patterns

### API Response
```typescript
type ApiResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };
```

### Async Function
```typescript
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

### Event Handler
```typescript
type EventMap = {
  click: { x: number; y: number };
  submit: { data: FormData };
};

type EventHandler<T extends keyof EventMap> = (
  event: EventMap[T]
) => void;
```

### Repository Pattern
```typescript
interface Repository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, "id">): Promise<T>;
  update(id: ID, updates: Partial<T>): Promise<T>;
  delete(id: ID): Promise<boolean>;
}
```

---

## Quick Shortcuts (VS Code)

- `⌘/Ctrl + Click` - Go to definition
- `F2` - Rename symbol
- `⌘/Ctrl + .` - Quick fix
- Hover over variable - See type info
- `⌘/Ctrl + Space` - Trigger autocomplete

---

**Remember:** TypeScript is about catching errors at compile time, not runtime. Use the type system to make impossible states unrepresentable!