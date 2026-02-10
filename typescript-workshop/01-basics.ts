// ============================================
// 01 - BASICS: Types, Inference & Functions
// ============================================

// --- Primitive Types ---
let username: string = "Alice";
let age: number = 30;
let isActive: boolean = true;

// --- Type Inference (let TS figure it out) ---
let city = "Jakarta"; // TS knows this is string
// city = 123;        // ❌ Error!

// --- Arrays ---
let scores: number[] = [90, 85, 100];
let names: string[] = ["Alice", "Bob"];

// --- Objects ---
let user: { name: string; age: number; email?: string } = {
  name: "Alice",
  age: 30,
  // email is optional (?)
};

// --- Functions ---
function greet(name: string): string {
  return `Hello, ${name}!`;
}

const add = (a: number, b: number): number => a + b;

// optional param
function introduce(name: string, role?: string): string {
  return role ? `${name} (${role})` : name;
}

// default param
function tax(price: number, rate: number = 0.1): number {
  return price * rate;
}

// void — no return value
function logger(msg: string): void {
  console.log(msg);
}

// --- any vs unknown ---
let risky: any = "hello"; // ⚠️ avoid — no type checking
risky = 123;
risky.whatever(); // no error, but will crash at runtime!

let safe: unknown = "hello"; // ✅ safer
if (typeof safe === "string") {
  console.log(safe.toUpperCase()); // must check type first
}

// --- Simple Real-World Example ---
type Product = {
  name: string;
  price: number;
  inStock: boolean;
};

function applyDiscount(product: Product, percent: number): number {
  return product.price * (1 - percent / 100);
}

const laptop: Product = { name: "MacBook", price: 2499, inStock: true };
console.log(applyDiscount(laptop, 10)); // 2249.1

// --- Type Assertions ---

// `as` — tell TS "trust me, I know the type" (use sparingly)
function loadData(): unknown {
  return { name: "MacBook", price: 2499, inStock: true };
}
const parsed = loadData() as Product;
console.log(parsed.name); // TS trusts you — no runtime check!

// `satisfies` (TS 5+) — validate shape WITHOUT widening
const defaultProduct = {
  name: "Keyboard",
  price: 79,
  inStock: true,
} satisfies Product;
// defaultProduct.name is "Keyboard" (literal), not just string

// Non-null assertion (!) — "I promise this isn't null"
// const el = document.getElementById("app")!;
// Safer: use an if-check instead

/*
  KEY TAKEAWAYS:
  ✅ Be explicit with function params & return types
  ✅ Let TS infer variable types when it's obvious
  ✅ Use ? for optional, use defaults where it makes sense
  ✅ Prefer unknown over any
  ✅ Prefer satisfies over as — it catches mistakes while keeping precision
  ✅ Use as sparingly — it bypasses type checking
*/
