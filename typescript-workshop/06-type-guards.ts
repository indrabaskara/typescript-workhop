// ============================================
// 06 - TYPE GUARDS & NARROWING
// ============================================

// --- typeof guard (for primitives) ---

function formatValue(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase(); // TS knows it's string
  }
  return value.toFixed(2); // TS knows it's number
}

console.log(formatValue("hello")); // "HELLO"
console.log(formatValue(3.1415)); // "3.14"

// --- instanceof guard (for classes) ---

class Dog {
  bark() {
    return "Woof!";
  }
}

class Cat {
  meow() {
    return "Meow!";
  }
}

function makeSound(animal: Dog | Cat): string {
  if (animal instanceof Dog) {
    return animal.bark(); // TS knows it's Dog
  }
  return animal.meow(); // TS knows it's Cat
}

// --- "in" operator (check if property exists) ---

type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim(); // TS knows it's Fish
  } else {
    animal.fly(); // TS knows it's Bird
  }
}

// --- Custom type guard (for complex checks) ---
// Use the "is" keyword in the return type

type User = { kind: "user"; name: string };
type Admin = { kind: "admin"; name: string; permissions: string[] };

function isAdmin(person: User | Admin): person is Admin {
  return person.kind === "admin";
}

function greet(person: User | Admin) {
  if (isAdmin(person)) {
    console.log(`Admin ${person.name} has ${person.permissions.length} perms`);
  } else {
    console.log(`Hello, ${person.name}`);
  }
}

greet({ kind: "admin", name: "Alice", permissions: ["write"] });
// → "Admin Alice has 1 perms"

greet({ kind: "user", name: "Bob" });
// → "Hello, Bob"

// --- Simple real-world example: API response ---

type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string };

function isSuccess<T>(res: ApiResponse<T>): res is { ok: true; data: T } {
  return res.ok === true;
}

function handleResponse(res: ApiResponse<string[]>) {
  if (isSuccess(res)) {
    console.log("Got items:", res.data.length); // TS knows data exists
  } else {
    console.log("Failed:", res.error); // TS knows error exists
  }
}

handleResponse({ ok: true, data: ["a", "b"] });
// → "Got items: 2"

handleResponse({ ok: false, error: "Network error" });
// → "Failed: Network error"

// --- Error handling: narrowing `unknown` in catch blocks ---
// In strict mode, catch variable is `unknown` — you must narrow it

function safeParseJSON(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch (err: unknown) {
    // ❌ err.message — won't compile, err is unknown
    // ✅ narrow first, then access properties
    if (err instanceof Error) {
      console.log("Parse error:", err.message); // TS knows it's Error
    } else {
      console.log("Unknown error:", err);
    }
    return null;
  }
}

safeParseJSON("not json");
// → "Parse error: ..."

safeParseJSON("{}");
// → returns {}

// Helper function: safely extract error message from anything
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "An unknown error occurred";
}

// Usage pattern — wrap risky operations cleanly
function riskyOperation(): string {
  try {
    throw new Error("Something broke");
  } catch (err: unknown) {
    return `Failed: ${getErrorMessage(err)}`;
  }
}

console.log(riskyOperation());
// → "Failed: Something broke"

// --- Custom Error classes with type narrowing ---

class ValidationError extends Error {
  constructor(
    public field: string,
    message: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

class NetworkError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

function handleError(err: unknown): string {
  if (err instanceof ValidationError) {
    return `Validation failed on "${err.field}": ${err.message}`;
  }
  if (err instanceof NetworkError) {
    return `Network error (${err.statusCode}): ${err.message}`;
  }
  return `Unexpected: ${getErrorMessage(err)}`;
}

console.log(handleError(new ValidationError("email", "Invalid format")));
// → 'Validation failed on "email": Invalid format'

console.log(handleError(new NetworkError(404, "Not found")));
// → "Network error (404): Not found"

/*
  KEY TAKEAWAYS:
  ✅ typeof     → for primitives (string, number, boolean)
  ✅ instanceof → for class instances (including custom Errors)
  ✅ "in"       → check if property exists on object
  ✅ Custom guard (x is Type) → for your own logic
  ✅ catch (err: unknown) → always narrow before accessing properties
  ✅ Create a getErrorMessage() helper for consistent error handling
  ✅ Use custom Error subclasses + instanceof for structured errors
*/
