/**
 * 06 - TYPE GUARDS & NARROWING
 * Runtime type checking for safer code
 */

// ============================================
// 1. TYPEOF TYPE GUARDS
// ============================================

// Basic typeof checks
function processValue(value: string | number) {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    return value.toUpperCase();
  } else {
    // TypeScript knows value is number here
    return value.toFixed(2);
  }
}

// Multiple typeof checks
function format(input: string | number | boolean): string {
  if (typeof input === "string") {
    return input.trim();
  } else if (typeof input === "number") {
    return input.toString();
  } else {
    return input ? "Yes" : "No";
  }
}

// ============================================
// 2. INSTANCEOF TYPE GUARDS
// ============================================

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
    return animal.bark();
  } else {
    return animal.meow();
  }
}

// With built-in classes
function processDate(input: Date | string): Date {
  if (input instanceof Date) {
    return input;
  } else {
    return new Date(input);
  }
}

// ============================================
// 3. CUSTOM TYPE GUARDS (TYPE PREDICATES)
// ============================================

interface User {
  type: "user";
  name: string;
  email: string;
}

interface Admin {
  type: "admin";
  name: string;
  email: string;
  permissions: string[];
}

// Custom type guard with "is" keyword
function isAdmin(user: User | Admin): user is Admin {
  return user.type === "admin";
}

function handleUser(user: User | Admin) {
  if (isAdmin(user)) {
    // TypeScript knows user is Admin here
    console.log(`Admin with ${user.permissions.length} permissions`);
  } else {
    // TypeScript knows user is User here
    console.log(`Regular user: ${user.name}`);
  }
}

// Type guard for checking properties
interface Person {
  name: string;
  age: number;
}

interface Company {
  name: string;
  employees: number;
}

function isPerson(entity: Person | Company): entity is Person {
  return "age" in entity;
}

function describeEntity(entity: Person | Company): string {
  if (isPerson(entity)) {
    return `${entity.name} is ${entity.age} years old`;
  } else {
    return `${entity.name} has ${entity.employees} employees`;
  }
}

// ============================================
// 4. IN OPERATOR NARROWING
// ============================================

type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}

// Checking optional properties
interface Car {
  brand: string;
  engine: string;
  sunroof?: boolean;
}

function describeCar(car: Car): string {
  let description = `${car.brand} with ${car.engine} engine`;

  if ("sunroof" in car && car.sunroof) {
    description += " and sunroof";
  }

  return description;
}

// ============================================
// 5. TRUTHINESS NARROWING
// ============================================

// Narrowing with truthiness checks
function printLength(value: string | null | undefined) {
  if (value) {
    // value is string here (not null or undefined)
    console.log(value.length);
  } else {
    console.log("No value");
  }
}

// Be careful with falsy values
function processNumber(num: number | null) {
  if (num) {
    console.log(num * 2);
  }
  // ⚠️ This will skip 0, which might not be intended!
}

// Better approach for numbers
function processNumberSafely(num: number | null) {
  if (num !== null) {
    console.log(num * 2); // Now 0 is processed correctly
  }
}

// ============================================
// 6. EQUALITY NARROWING
// ============================================

function compare(x: string | number, y: string | boolean) {
  if (x === y) {
    // Both must be string here (only common type)
    console.log(x.toUpperCase());
    console.log(y.toUpperCase());
  }
}

// Narrowing with equality
type Status = "loading" | "success" | "error";

function handleStatus(status: Status) {
  if (status === "loading") {
    console.log("Loading...");
  } else if (status === "success") {
    console.log("Success!");
  } else {
    // TypeScript knows status is "error" here
    console.log("Error occurred");
  }
}

// ============================================
// 7. DISCRIMINATED UNIONS
// ============================================

// Using a common property to discriminate
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

type Shape = Circle | Square | Rectangle;

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    case "rectangle":
      return shape.width * shape.height;
    default:
      // Exhaustiveness check
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}

// ============================================
// 8. REAL-WORLD EXAMPLE: API Response Handler
// ============================================

interface SuccessResponse<T> {
  status: "success";
  data: T;
  timestamp: Date;
}

interface ErrorResponse {
  status: "error";
  message: string;
  code: number;
  timestamp: Date;
}

interface LoadingResponse {
  status: "loading";
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse | LoadingResponse;

// Type guard functions
function isSuccess<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return response.status === "success";
}

function isError<T>(response: ApiResponse<T>): response is ErrorResponse {
  return response.status === "error";
}

function isLoading<T>(response: ApiResponse<T>): response is LoadingResponse {
  return response.status === "loading";
}

// Using the type guards
function handleResponse<T>(response: ApiResponse<T>): T | null {
  if (isLoading(response)) {
    console.log("Still loading...");
    return null;
  }

  if (isError(response)) {
    console.error(`Error ${response.code}: ${response.message}`);
    return null;
  }

  if (isSuccess(response)) {
    console.log("Data received:", response.data);
    return response.data;
  }

  // This should never happen
  const _exhaustive: never = response;
  return _exhaustive;
}

// Example usage
type UserData = { id: number; name: string };

const successResponse: ApiResponse<UserData> = {
  status: "success",
  data: { id: 1, name: "John" },
  timestamp: new Date(),
};

const errorResponse: ApiResponse<UserData> = {
  status: "error",
  message: "User not found",
  code: 404,
  timestamp: new Date(),
};

handleResponse(successResponse); // Returns user data
handleResponse(errorResponse);   // Returns null

// ============================================
// 9. REAL-WORLD EXAMPLE: Form Validation
// ============================================

interface ValidationSuccess {
  valid: true;
  value: string;
}

interface ValidationError {
  valid: false;
  errors: string[];
}

type ValidationResult = ValidationSuccess | ValidationError;

function isValidationSuccess(result: ValidationResult): result is ValidationSuccess {
  return result.valid === true;
}

function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email) {
    errors.push("Email is required");
  }

  if (email && !email.includes("@")) {
    errors.push("Email must contain @");
  }

  if (email && email.length < 5) {
    errors.push("Email is too short");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, value: email };
}

function processEmailValidation(email: string) {
  const result = validateEmail(email);

  if (isValidationSuccess(result)) {
    console.log(`Valid email: ${result.value}`);
    // Can access result.value safely
  } else {
    console.log("Validation errors:");
    result.errors.forEach((error) => console.log(`- ${error}`));
    // Can access result.errors safely
  }
}

// ============================================
// 10. ARRAY TYPE GUARDS
// ============================================

// Check if array contains specific type
function isStringArray(arr: unknown): arr is string[] {
  return Array.isArray(arr) && arr.every((item) => typeof item === "string");
}

function isNumberArray(arr: unknown): arr is number[] {
  return Array.isArray(arr) && arr.every((item) => typeof item === "number");
}

function processArray(arr: unknown) {
  if (isStringArray(arr)) {
    // arr is string[] here
    return arr.map((s) => s.toUpperCase());
  } else if (isNumberArray(arr)) {
    // arr is number[] here
    return arr.map((n) => n * 2);
  } else {
    return [];
  }
}

// ============================================
// 11. NULL/UNDEFINED CHECKING
// ============================================

function processUser(user: User | null | undefined) {
  // Non-null assertion (use carefully!)
  // const name = user!.name;

  // Better: explicit null check
  if (user === null || user === undefined) {
    console.log("No user");
    return;
  }

  // user is User here
  console.log(user.name);
}

// Optional chaining and nullish coalescing
function getUserEmail(user: User | null | undefined): string {
  // Safe navigation with optional chaining
  const email = user?.email;

  // Provide default with nullish coalescing
  return email ?? "no-email@example.com";
}

// ============================================
// 12. ASSERTION FUNCTIONS
// ============================================

// Assertion function that throws if condition is false
function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value must be a string");
  }
}

function processInput(input: unknown) {
  assertIsString(input);
  // TypeScript knows input is string after assertion
  console.log(input.toUpperCase());
}

// ============================================
// KEY TAKEAWAYS
// ============================================

/*
✅ typeof - for primitive type checking (string, number, boolean, etc.)
✅ instanceof - for class instances
✅ Custom type guards - use "is" for complex type checking
✅ "in" operator - check if property exists
✅ Discriminated unions - use common property to narrow types
✅ Truthiness - be careful with falsy values (0, "", false)
✅ Type guards make code safer by narrowing types at runtime
✅ Always provide fallback/default cases for exhaustiveness
*/
