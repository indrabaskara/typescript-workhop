/**
 * 01 - TYPE ANNOTATIONS & INFERENCE
 * Learn the fundamentals of TypeScript types
 */

// ============================================
// 1. BASIC TYPE ANNOTATIONS
// ============================================

// Primitive types
let username: string = "John Doe";
let age: number = 25;
let isActive: boolean = true;
let data: null = null;
let notDefined: undefined = undefined;

// Type inference - TypeScript automatically detects the type
let city = "New York"; // TypeScript infers this as string
// city = 123; // ❌ Error: Type 'number' is not assignable to type 'string'

// ============================================
// 2. ARRAYS & OBJECTS
// ============================================

// Arrays
let numbers: number[] = [1, 2, 3, 4, 5];
let names: Array<string> = ["Alice", "Bob", "Charlie"]; // Alternative syntax

// Objects
let user: { name: string; age: number; email: string } = {
  name: "Jane",
  age: 28,
  email: "jane@example.com",
};

// Optional properties with ?
let product: { name: string; price: number; description?: string } = {
  name: "Laptop",
  price: 999,
  // description is optional
};

// ============================================
// 3. FUNCTIONS
// ============================================

// Function with type annotations
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Arrow function
const add = (a: number, b: number): number => {
  return a + b;
};

// Optional parameters
function createUser(name: string, age: number, email?: string) {
  return { name, age, email };
}

// Default parameters
function multiply(a: number, b: number = 2): number {
  return a * b;
}

// Void return type (no return value)
function logMessage(message: string): void {
  console.log(message);
}

// ============================================
// 4. ANY, UNKNOWN, NEVER
// ============================================

// any - avoid when possible (opts out of type checking)
let anything: any = "hello";
anything = 123;
anything = true;

// unknown - safer than any (requires type checking before use)
let userInput: unknown = "some user input";
if (typeof userInput === "string") {
  console.log(userInput.toUpperCase()); // ✅ Safe after type check
}

// never - for functions that never return
function throwError(message: string): never {
  throw new Error(message);
}

// ============================================
// 5. REAL-WORLD EXAMPLE: E-commerce Product
// ============================================

// Simple product type
type Product = {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  tags?: string[];
};

// Function to calculate discount
function applyDiscount(product: Product, discountPercent: number): number {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error("Discount must be between 0 and 100");
  }
  return product.price * (1 - discountPercent / 100);
}

// Function to check if product is available
function isAvailable(product: Product): boolean {
  return product.inStock && product.price > 0;
}

// Usage
const laptop: Product = {
  id: 1,
  name: "MacBook Pro",
  price: 2499,
  inStock: true,
  tags: ["electronics", "computers"],
};

const discountedPrice = applyDiscount(laptop, 10); // $2249.10
console.log(`Discounted price: $${discountedPrice}`);

// ============================================
// KEY TAKEAWAYS
// ============================================

/*
✅ Use explicit types for function parameters and return values
✅ Let TypeScript infer types for variables when obvious
✅ Use optional properties (?) for non-required fields
✅ Avoid 'any' - use 'unknown' if type is truly unknown
✅ Type annotations help catch errors at compile time, not runtime
*/
