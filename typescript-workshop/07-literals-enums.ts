// ============================================
// 07 - LITERAL TYPES, ENUMS & as const
// ============================================

// --- String Literal Types ---
// Only these exact values are allowed

type Direction = "up" | "down" | "left" | "right";

function move(dir: Direction) {
  console.log(`Moving ${dir}`);
}

move("up"); // ✅
// move("diagonal"); // ❌ not in the union

// --- Use them in objects for strict fields ---

type Order = {
  id: number;
  status: "pending" | "shipped" | "delivered";
};

const order: Order = { id: 1, status: "shipped" }; // ✅
// const bad: Order = { id: 2, status: "cancelled" }; // ❌

// --- Number Literal Types ---

type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

function roll(): DiceRoll {
  return (Math.floor(Math.random() * 6) + 1) as DiceRoll;
}

// --- Enums (grouped constants) ---
// Use when you have a fixed set of related values

enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warn = "WARN",
  Error = "ERROR",
}

function log(message: string, level: LogLevel) {
  console.log(`[${level}] ${message}`);
}

log("Server started", LogLevel.Info); // [INFO] Server started
log("Disk full", LogLevel.Error); // [ERROR] Disk full

// Numeric enums (auto-increment from 0)
enum HttpStatus {
  Ok = 200,
  NotFound = 404,
  ServerError = 500,
}

function isSuccess(status: HttpStatus): boolean {
  return status === HttpStatus.Ok;
}

// --- When to use enum vs literal type? ---

// ✅ Literal type — simple, lightweight, most cases
type Theme = "light" | "dark";

// ✅ Enum — when you need a namespace or numeric values
enum Permission {
  Read = 1,
  Write = 2,
  Admin = 4,
}

// --- as const — freeze values into literal types ---

// Without as const:
const colors1 = { primary: "blue", secondary: "green" };
// type is { primary: string, secondary: string } — too wide

// With as const:
const colors2 = { primary: "blue", secondary: "green" } as const;
// type is { readonly primary: "blue", readonly secondary: "green" } — exact

// Great for deriving types from data
const ROLES = ["admin", "editor", "viewer"] as const;
type Role = (typeof ROLES)[number]; // "admin" | "editor" | "viewer"

const ENDPOINTS = {
  users: "/api/users",
  posts: "/api/posts",
} as const;

type Endpoint = (typeof ENDPOINTS)[keyof typeof ENDPOINTS];
// "/api/users" | "/api/posts"

/*
  KEY TAKEAWAYS:
  ✅ Literal types ("up" | "down") = lightweight, use most of the time
  ✅ Enums = good for namespaced constants or numeric flags
  ✅ as const = turn runtime values into exact types
  ✅ Prefer literal types over enums for simple string sets
*/
