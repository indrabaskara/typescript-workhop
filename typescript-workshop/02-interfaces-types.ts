// ============================================
// 02 - INTERFACES vs TYPES
// ============================================

// One example showing interface (extends & merge), type (unions &
// intersections), and when to use which.

// --- Interface: best for object shapes (can extend & merge) ---
interface BaseUser {
  id: number;
  name: string;
  email: string;
}

interface Admin extends BaseUser {
  role: "admin" | "superadmin";
}

const admin: Admin = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  role: "admin",
};

// --- Type: best for unions, intersections & aliases ---
type Status = "active" | "inactive" | "banned";

/**
 * Represents an API result that can be either a success or an error.
 * Demonstrates union types for mutually exclusive outcomes.
 */
type Result = { ok: true; data: BaseUser } | { ok: false; error: string };

function handleResult(result: Result): string {
  if (result.ok) {
    return `User: ${result.data.name}`;
  }
  return `Error: ${result.error}`;
}

console.log(handleResult({ ok: true, data: admin }));
// → "User: Alice"

console.log(handleResult({ ok: false, error: "Not found" }));
// → "Error: Not found"

/*
  KEY TAKEAWAYS:
  ✅ interface for object shapes (can extend & merge)
  ✅ type for unions, tuples, and combining types
  ✅ For simple objects, both work — just be consistent
*/
