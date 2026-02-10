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

/*
  KEY TAKEAWAYS:
  ✅ typeof     → for primitives (string, number, boolean)
  ✅ instanceof → for class instances
  ✅ "in"       → check if property exists on object
  ✅ Custom guard (x is Type) → for your own logic
  ✅ After a guard, TS automatically narrows the type for you
*/
