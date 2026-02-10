// ============================================
// 02 - INTERFACES vs TYPES
// ============================================

// --- Interface: best for object shapes ---
interface User {
  id: number;
  name: string;
  email: string;
}

// extends = inheritance
interface Admin extends User {
  role: "admin" | "superadmin";
}

const admin: Admin = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  role: "admin",
};

// --- Type: best for unions & combinations ---
type Status = "active" | "inactive" | "banned";
type ID = string | number;

type Product = {
  id: ID;
  name: string;
  price: number;
};

// intersection (&) = combine types
type ProductWithStock = Product & {
  inStock: boolean;
};

const item: ProductWithStock = {
  id: "abc",
  name: "Keyboard",
  price: 79,
  inStock: true,
};

// --- Key Difference: declaration merging ---
// Interfaces can be declared twice — they merge
interface Config {
  apiUrl: string;
}
interface Config {
  timeout: number;
}

// Now Config has BOTH properties
const config: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};

// Types CANNOT be declared twice
// type Config = { debug: boolean }; // ❌ Error: duplicate

// --- When to use which? ---

// ✅ interface → objects, classes, public APIs
interface Order {
  id: string;
  total: number;
  status: Status;
}

// ✅ type → unions, intersections, simple aliases
type Result = { ok: true; data: User } | { ok: false; error: string };
type Coordinate = [number, number];
type Callback = (value: string) => void;

/*
  KEY TAKEAWAYS:
  ✅ interface for object shapes (can extend & merge)
  ✅ type for unions, tuples, and combining types
  ✅ For simple objects, both work — just be consistent
*/
