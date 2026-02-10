// ============================================
// 07 - LITERAL TYPES, ENUMS & as const
// ============================================

// One example: a logging system showing string literals, enums,
// and as const for deriving types from data.

// --- String Literal Type ---
type LogLevel = "debug" | "info" | "warn" | "error";

// --- Enum (when you need a namespace or numeric values) ---
enum HttpStatus {
  Ok = 200,
  NotFound = 404,
  ServerError = 500,
}

// --- as const: derive a type from runtime data ---
const ENDPOINTS = {
  users: "/api/users",
  posts: "/api/posts",
} as const;

type Endpoint = (typeof ENDPOINTS)[keyof typeof ENDPOINTS];
// "/api/users" | "/api/posts"

/**
 * Logs a message with a given severity level.
 * Demonstrates literal types restricting values at compile time.
 * @param message - The log message.
 * @param level - The severity level (literal type).
 */
function log(message: string, level: LogLevel): void {
  console.log(`[${level.toUpperCase()}] ${message}`);
}

log("Server started", "info"); // ✅
// log("Oops", "critical");    // ❌ not in the union

console.log(HttpStatus.Ok); // 200

/*
  KEY TAKEAWAYS:
  ✅ Literal types ("up" | "down") = lightweight, use most of the time
  ✅ Enums = good for namespaced constants or numeric flags
  ✅ as const = turn runtime values into exact types
  ✅ Prefer literal types over enums for simple string sets
*/
