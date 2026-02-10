# Modern TypeScript Workshop
## From Basics to Advanced - 50 Minutes

---

## 👋 Welcome!

**What we'll cover:**
- TypeScript fundamentals (15 min)
- Practical patterns (20 min)
- Advanced concepts (15 min)

**Prerequisites:**
- Basic JavaScript knowledge
- Node.js installed
- TypeScript installed (`npm install -g typescript`)

---

## Part 1: Foundations (15 min)

### 1.1 Why TypeScript?

```typescript
// JavaScript - errors at runtime
function greet(person) {
  return "Hello, " + person.name;
}
greet("John"); // Runtime error! 💥

// TypeScript - errors at compile time
function greet(person: { name: string }) {
  return "Hello, " + person.name;
}
greet("John"); // Compile error! ✅ Caught before running
```

**Benefits:**
- Catch bugs early
- Better IDE support (autocomplete, refactoring)
- Self-documenting code
- Safer refactoring

---

### 1.2 Type Annotations & Inference

```typescript
// Explicit types
let name: string = "John";
let age: number = 25;

// Type inference (TypeScript figures it out)
let city = "New York"; // inferred as string

// Functions
function add(a: number, b: number): number {
  return a + b;
}

// Objects
let user: { name: string; age: number } = {
  name: "Jane",
  age: 28,
};
```

**Key Takeaway:** Let TypeScript infer when obvious, be explicit for function parameters and return types.

---

### 1.3 Interfaces vs Types

**Use Interface for:**
- Object shapes
- Class contracts
- When you might extend

```typescript
interface User {
  id: number;
  name: string;
}

interface Admin extends User {
  permissions: string[];
}
```

**Use Type for:**
- Unions
- Intersections
- Complex types

```typescript
type Status = "pending" | "approved" | "rejected";
type Result<T> = { success: true; data: T } | { success: false; error: string };
```

---

### 1.4 Unions & Intersections

**Union (OR) - can be one of several types:**
```typescript
type ID = string | number;
type Status = "active" | "inactive" | "pending";

function processId(id: ID) {
  if (typeof id === "string") {
    return id.toUpperCase();
  } else {
    return id.toString();
  }
}
```

**Intersection (AND) - combines types:**
```typescript
type HasName = { name: string };
type HasAge = { age: number };
type Person = HasName & HasAge; // Must have BOTH

const person: Person = { name: "John", age: 30 };
```

---

## Part 2: Practical Patterns (20 min)

### 2.1 Generics - Reusable Code

**Problem:** Different functions for different types
```typescript
function getFirstNumber(arr: number[]): number { return arr[0]; }
function getFirstString(arr: string[]): string { return arr[0]; }
```

**Solution:** Generics!
```typescript
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const num = getFirst([1, 2, 3]);     // T is number
const str = getFirst(["a", "b"]);    // T is string
```

**Real-world example:**
```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
}

const userResponse: ApiResponse<User> = {
  data: { id: 1, name: "John" },
  status: 200,
};
```

---

### 2.2 Utility Types - Built-in Superpowers

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Make all properties optional
type PartialUser = Partial<User>;

// Select specific properties
type PublicUser = Omit<User, "password">;

// For creating (no id yet)
type CreateUserDTO = Omit<User, "id">;

// For updating (all optional, no id)
type UpdateUserDTO = Partial<Omit<User, "id">>;
```

**Most useful utilities:**
- `Partial<T>` - all optional
- `Required<T>` - all required
- `Readonly<T>` - all readonly
- `Pick<T, K>` - select properties
- `Omit<T, K>` - exclude properties
- `Record<K, T>` - create object type

---

### 2.3 Type Guards - Runtime Type Checking

```typescript
function processValue(value: string | number) {
  // typeof type guard
  if (typeof value === "string") {
    return value.toUpperCase(); // TypeScript knows it's string
  } else {
    return value.toFixed(2); // TypeScript knows it's number
  }
}

// Custom type guard
interface User { type: "user"; name: string; }
interface Admin { type: "admin"; name: string; permissions: string[]; }

function isAdmin(user: User | Admin): user is Admin {
  return user.type === "admin";
}

function greet(user: User | Admin) {
  if (isAdmin(user)) {
    console.log(`Admin: ${user.permissions.length} permissions`);
  } else {
    console.log(`User: ${user.name}`);
  }
}
```

---

### 2.4 Literal Types & Enums

**String Literals:**
```typescript
type Status = "pending" | "approved" | "rejected";

function updateStatus(status: Status) {
  // TypeScript ensures only these values are allowed
}

updateStatus("approved"); // ✅
updateStatus("cancelled"); // ❌ Error
```

**Enums for grouped constants:**
```typescript
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warning = "WARNING",
  Error = "ERROR",
}

function log(message: string, level: LogLevel) {
  console.log(`[${level}] ${message}`);
}

log("App started", LogLevel.Info);
```

**Rule of thumb:** Use literal types for simple values, enums for grouped constants.

---

## Part 3: Advanced Concepts (15 min)

### 3.1 Discriminated Unions - Type-Safe State

**The Problem:** Optional properties lead to invalid states
```typescript
// ❌ Bad - multiple properties could be set
type State = {
  loading?: boolean;
  data?: string;
  error?: string;
};
// What if loading AND error are both true?
```

**The Solution:** Discriminated unions
```typescript
// ✅ Good - only one state at a time
type State =
  | { type: "loading" }
  | { type: "success"; data: string }
  | { type: "error"; error: string };

function handleState(state: State) {
  switch (state.type) {
    case "loading":
      return "Loading...";
    case "success":
      return state.data; // data is guaranteed to exist
    case "error":
      return state.error; // error is guaranteed to exist
  }
}
```

**Real-world: API Responses**
```typescript
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: number };

async function fetchUser(): Promise<ApiResult<User>> {
  try {
    const user = await api.get("/user");
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: "Failed", code: 500 };
  }
}
```

---

### 3.2 Conditional Types - Dynamic Types

```typescript
// Basic: T extends U ? X : Y
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// Real-world: Extract array element type
type ArrayElement<T> = T extends (infer U)[] ? U : T;

type Numbers = ArrayElement<number[]>; // number
type Strings = ArrayElement<string[]>; // string

// Form fields with type-safe values
type FieldValue<T extends "text" | "number" | "checkbox"> =
  T extends "number" ? number :
  T extends "checkbox" ? boolean :
  string;

const numberField: FieldValue<"number"> = 42; // must be number
const textField: FieldValue<"text"> = "hello"; // must be string
```

---

### 3.3 Advanced Pattern: Repository

```typescript
interface Repository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, "id">): Promise<T>;
  update(id: ID, updates: Partial<T>): Promise<T>;
  delete(id: ID): Promise<boolean>;
}

class UserRepository implements Repository<User, number> {
  async findById(id: number): Promise<User | null> {
    // Implementation
  }
  
  async create(data: Omit<User, "id">): Promise<User> {
    // Implementation - no need to provide id!
  }
  
  // ... other methods
}
```

---

### 3.4 Advanced Pattern: Builder

```typescript
class QueryBuilder<T> {
  private filters: Array<(item: T) => boolean> = [];
  
  where(predicate: (item: T) => boolean): this {
    this.filters.push(predicate);
    return this; // Return 'this' for chaining
  }
  
  sortBy(fn: (a: T, b: T) => number): this {
    this.sortFn = fn;
    return this;
  }
  
  execute(data: T[]): T[] {
    // Apply all filters and sorting
  }
}

// Fluent, type-safe API
const results = new QueryBuilder<Product>()
  .where(p => p.price > 100)
  .where(p => p.inStock)
  .sortBy((a, b) => b.price - a.price)
  .execute(products);
```

---

## 🎯 Key Takeaways

### Do's ✅
1. **Use type inference** - don't over-annotate
2. **Be explicit with functions** - parameter and return types
3. **Use discriminated unions** - for state management
4. **Leverage utility types** - reduce boilerplate
5. **Use `unknown` over `any`** - when type is truly unknown
6. **Enable strict mode** - in tsconfig.json

### Don'ts ❌
1. **Avoid `any`** - it disables type checking
2. **Don't ignore errors** - they're there to help
3. **Don't over-complicate** - simple types are good
4. **Don't use type assertions** - unless absolutely necessary

---

## 📚 Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Type Challenges](https://github.com/type-challenges/type-challenges)
- [Effective TypeScript](https://effectivetypescript.com/)

---

## 🏆 Workshop Files

1. `01-basics.ts` - Type annotations & inference
2. `02-interfaces-types.ts` - Interfaces vs Types
3. `03-unions-intersections.ts` - Combining types
4. `04-generics.ts` - Generic patterns
5. `05-utility-types.ts` - Built-in utilities
6. `06-type-guards.ts` - Runtime type checking
7. `07-literals-enums.ts` - Precise types
8. `08-discriminated-unions.ts` - State management
9. `09-conditional-types.ts` - Type transformations
10. `10-advanced-patterns.ts` - Real-world examples

**Plus:**
- `CHEATSHEET.md` - Quick reference
- `EXERCISES.md` - Hands-on practice

---

## 🚀 Next Steps

1. **Practice** - Use the exercises
2. **Convert a JS project** - Start small
3. **Read documentation** - Official TypeScript docs
4. **Join the community** - Stack Overflow, Discord, Reddit
5. **Keep learning** - TypeScript is constantly evolving

---

## ❓ Q&A

**Common Questions:**

**Q: When should I use `interface` vs `type`?**
A: Interface for object shapes, type for unions/intersections. Both work for simple objects - pick one and be consistent.

**Q: Is TypeScript worth the overhead?**
A: Absolutely! The time saved debugging runtime errors far outweighs the time spent writing types.

**Q: Can I gradually adopt TypeScript?**
A: Yes! Rename `.js` to `.ts`, set `"strict": false` initially, then gradually increase strictness.

**Q: What about third-party libraries?**
A: Most popular libraries have type definitions (`@types/package-name`) or built-in types.

---

## Thank You! 🙏

**Remember:** TypeScript is a tool to help you write better code. Don't fight it - embrace it!

**Feedback:** Please share your thoughts and questions!

**Keep in touch:** Happy to help with TypeScript questions anytime.

---

## Workshop Completion Checklist

- [ ] Understand basic types and inference
- [ ] Know when to use interface vs type
- [ ] Can work with unions and intersections
- [ ] Comfortable with generics
- [ ] Know the essential utility types
- [ ] Can write type guards
- [ ] Understand discriminated unions
- [ ] Practiced with exercises
- [ ] Have resources for continued learning

**Congratulations on completing the workshop! 🎉**