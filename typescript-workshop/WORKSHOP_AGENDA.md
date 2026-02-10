# TypeScript Workshop Agenda
## 50-Minute Hands-On Workshop

---

## 📅 Workshop Schedule

| Time | Duration | Topic | File | Activity |
|------|----------|-------|------|----------|
| 0:00 | 5 min | Introduction & Setup | - | Welcome, objectives, Q&A |
| 0:05 | 10 min | **Part 1: Foundations** | 01-03 | Live coding + discussion |
| 0:15 | 15 min | **Part 2: Practical Patterns** | 04-07 | Live coding + exercises |
| 0:30 | 15 min | **Part 3: Advanced Concepts** | 08-10 | Live coding + exercises |
| 0:45 | 5 min | Wrap-up & Resources | - | Key takeaways, next steps |

**Total: 50 minutes**

---

## 🎯 Introduction (0:00 - 0:05) — 5 minutes

### Objectives
- Welcome participants
- Set expectations
- Quick environment check
- Share workshop materials

### Talking Points
1. **Why TypeScript?**
   - Catch errors before runtime
   - Better IDE support and autocomplete
   - Self-documenting code
   - Easier refactoring

2. **What We'll Cover**
   - Fundamentals to advanced patterns
   - Real-world examples only
   - Hands-on exercises
   - Practical takeaways

3. **How to Follow Along**
   - Files are in order (01-10)
   - Each file is self-contained
   - Try examples yourself
   - Ask questions anytime

### Setup Check
```bash
# Quick verification
tsc --version    # Should show 5.x+
ts-node --version
code --version   # VS Code (optional)
```

---

## 📚 Part 1: Foundations (0:05 - 0:15) — 10 minutes

### 1.1 Type Annotations & Inference (3 min) → `01-basics.ts`

**Key Concepts:**
- Primitive types: `string`, `number`, `boolean`
- Arrays and objects
- Function signatures
- Type inference vs explicit types

**Live Code Example:**
```typescript
// Show the problem (JavaScript)
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
calculateTotal("oops"); // Runtime error!

// Show the solution (TypeScript)
function calculateTotal(items: { price: number }[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
// calculateTotal("oops"); // Compile error! ✅
```

**Quick Exercise:** Fix the broken function types (1 min)

---

### 1.2 Interfaces vs Types (3 min) → `02-interfaces-types.ts`

**Key Concepts:**
- When to use `interface`
- When to use `type`
- Extending and composing

**Live Code Example:**
```typescript
// Interface for object shapes
interface User {
  id: number;
  name: string;
}

// Type for unions
type Status = "active" | "inactive" | "pending";
type Result = { success: true; data: User } | { success: false; error: string };
```

**Rule of Thumb:**
- Interface → objects and classes
- Type → unions, intersections, primitives

---

### 1.3 Unions & Intersections (4 min) → `03-unions-intersections.ts`

**Key Concepts:**
- Union (OR): `string | number`
- Intersection (AND): `Type1 & Type2`
- Real-world use cases

**Live Code Example:**
```typescript
// Payment method example
type CreditCard = {
  type: "credit_card";
  cardNumber: string;
};

type PayPal = {
  type: "paypal";
  email: string;
};

type PaymentMethod = CreditCard | PayPal; // Union!

function processPayment(method: PaymentMethod) {
  if (method.type === "credit_card") {
    console.log(`Charging card: ${method.cardNumber}`);
  } else {
    console.log(`PayPal: ${method.email}`);
  }
}
```

---

## 🔧 Part 2: Practical Patterns (0:15 - 0:30) — 15 minutes

### 2.1 Generics (4 min) → `04-generics.ts`

**Key Concepts:**
- Generic functions
- Generic classes
- Type constraints
- Real-world API client

**Live Code Example:**
```typescript
// Without generics (bad)
function getFirstNumber(arr: number[]): number { return arr[0]; }
function getFirstString(arr: string[]): string { return arr[0]; }

// With generics (good!)
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const num = getFirst([1, 2, 3]);     // T is number
const str = getFirst(["a", "b"]);    // T is string
```

**Quick Exercise:** Create generic Cache class (2 min)

---

### 2.2 Utility Types (4 min) → `05-utility-types.ts`

**Key Concepts:**
- `Partial<T>`, `Required<T>`, `Readonly<T>`
- `Pick<T, K>`, `Omit<T, K>`
- `Record<K, T>`
- Real-world DTOs

**Live Code Example:**
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// For updates - all optional
type UpdateUserDTO = Partial<Omit<User, "id">>;

// For public API - no password
type PublicUser = Omit<User, "password">;

// For creation - no id yet
type CreateUserDTO = Omit<User, "id">;
```

**Show:** How this reduces boilerplate in real APIs

---

### 2.3 Type Guards (3 min) → `06-type-guards.ts`

**Key Concepts:**
- `typeof` and `instanceof`
- Custom type guards with `is`
- `in` operator
- Narrowing types safely

**Live Code Example:**
```typescript
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

### 2.4 Literals & Enums (4 min) → `07-literals-enums.ts`

**Key Concepts:**
- String literal types
- Template literal types
- When to use enums vs literals
- `as const` pattern

**Live Code Example:**
```typescript
// Literal types
type Status = "pending" | "approved" | "rejected";

// Template literals
type EventHandler = `on${Capitalize<"click" | "scroll">}`;
// Result: "onClick" | "onScroll"

// String enums
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Error = "ERROR"
}
```

**Quick Exercise:** Create type-safe feature flags (1 min)

---

## 🚀 Part 3: Advanced Concepts (0:30 - 0:45) — 15 minutes

### 3.1 Discriminated Unions (5 min) → `08-discriminated-unions.ts`

**Key Concepts:**
- Common discriminant property
- Exhaustiveness checking
- State management
- Preventing impossible states

**Live Code Example:**
```typescript
// ❌ Bad - allows invalid states
type BadState = {
  loading?: boolean;
  data?: string;
  error?: string;
};

// ✅ Good - only one state at a time
type State =
  | { type: "loading" }
  | { type: "success"; data: string }
  | { type: "error"; error: string };

function render(state: State) {
  switch (state.type) {
    case "loading": return "Loading...";
    case "success": return state.data;
    case "error": return state.error;
    default:
      const _exhaustive: never = state; // Ensures all cases handled!
      return _exhaustive;
  }
}
```

**Real-World:** Show Redux actions or API responses

---

### 3.2 Conditional Types (5 min) → `09-conditional-types.ts`

**Key Concepts:**
- `T extends U ? X : Y` syntax
- `infer` keyword
- Distributive conditionals
- Type transformations

**Live Code Example:**
```typescript
// Extract return type
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: 1, name: "John" };
}

type UserType = GetReturnType<typeof getUser>;
// { id: number; name: string }

// Dynamic field types
type FieldValue<T extends "text" | "number" | "checkbox"> =
  T extends "number" ? number :
  T extends "checkbox" ? boolean :
  string;
```

**Show:** How libraries use this for type magic

---

### 3.3 Advanced Patterns (5 min) → `10-advanced-patterns.ts`

**Key Concepts:**
- Builder pattern
- Repository pattern
- Dependency injection
- Strategy pattern

**Live Code Example:**
```typescript
// Builder pattern with fluent API
class QueryBuilder<T> {
  where(fn: (item: T) => boolean): this {
    // ...
    return this; // Fluent!
  }
  
  sortBy(fn: (a: T, b: T) => number): this {
    // ...
    return this;
  }
  
  execute(data: T[]): T[] {
    // Apply filters and sorting
  }
}

// Usage
const results = new QueryBuilder<Product>()
  .where(p => p.price > 100)
  .where(p => p.inStock)
  .sortBy((a, b) => b.price - a.price)
  .execute(products);
```

**Quick Exercise:** Implement simple Repository (2 min)

---

## 🎓 Wrap-up (0:45 - 0:50) — 5 minutes

### Key Takeaways

**✅ DO:**
- Let TypeScript infer types when obvious
- Use explicit types for function parameters
- Use interfaces for objects, types for unions
- Leverage utility types
- Use discriminated unions for state
- Enable strict mode

**❌ DON'T:**
- Overuse `any`
- Ignore TypeScript errors
- Over-complicate types
- Use type assertions unless necessary

### Resources Provided
- ✅ All workshop files (01-10)
- ✅ Cheat sheet (`CHEATSHEET.md`)
- ✅ Exercises (`EXERCISES.md`)
- ✅ Complete examples with explanations

### Next Steps
1. Complete the exercises
2. Try TypeScript in a small project
3. Read the official handbook
4. Join TypeScript community

### Q&A (2 min)
- Answer any remaining questions
- Share contact info for follow-up
- Collect feedback

---

## 📊 Timing Tips for Presenters

### If Running Short on Time (< 50 min):
- **Skip:** Detailed conditional types (09)
- **Skip:** Advanced patterns deep-dive (10)
- **Focus:** Basics (01-03), Generics (04), Utility Types (05)
- **Mention:** Other topics exist for self-study

### If You Have Extra Time (> 50 min):
- More exercises (use `EXERCISES.md`)
- Live debugging session
- Convert JavaScript code to TypeScript together
- Deep dive into participants' real-world scenarios

### Pacing Indicators:
- ⚡ **5 min mark:** Should be done with intro
- ⚡ **15 min mark:** Finished Part 1 (basics)
- ⚡ **30 min mark:** Finished Part 2 (practical)
- ⚡ **45 min mark:** Finished Part 3 (advanced)
- ⚡ **50 min mark:** Wrap-up complete

---

## 🎯 Learning Objectives Checklist

By the end of this workshop, participants should be able to:

- [ ] Understand TypeScript's type system
- [ ] Choose between interface and type
- [ ] Work with unions and intersections
- [ ] Write generic functions and classes
- [ ] Use utility types effectively
- [ ] Implement type guards
- [ ] Use discriminated unions for state management
- [ ] Apply TypeScript patterns to real projects
- [ ] Configure TypeScript for a project
- [ ] Debug TypeScript errors

---

## 💡 Pro Tips for Presenters

### Before Workshop:
1. Test all code examples
2. Have TypeScript Playground open (backup)
3. Prepare 2-3 real-world examples from your codebase
4. Set up screen sharing with large font
5. Have cheat sheet ready to share

### During Workshop:
1. Start with "why" before "how"
2. Live code when possible (no copy-paste)
3. Make intentional errors to show TypeScript's help
4. Use VS Code IntelliSense to show benefits
5. Encourage questions throughout

### After Workshop:
1. Share all files immediately
2. Provide contact for follow-up questions
3. Send additional resources
4. Gather feedback for improvements

---

## 📝 Alternative Formats

### 90-Minute Extended Workshop
- Add 20 min for exercises
- Add 10 min for debugging session
- Add 10 min for extended Q&A

### 30-Minute Lunch & Learn
- Cover only 01, 02, 04, 05
- Show cheat sheet
- Encourage self-study for rest

### 2-Hour Deep Dive
- All topics in depth
- Complete all exercises together
- Real codebase conversion session

---

**Ready to teach TypeScript? You've got this! 🚀**