// ============================================
// 05 - UTILITY TYPES
// ============================================

// One example: a User CRUD showing Partial, Omit, Pick, Readonly,
// and Record in a single real-world scenario.

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Omit id (auto-generated) for creation input
type CreateUserInput = Omit<User, "id">;

// Partial + Omit for update input (all optional, can't change id)
type UpdateUserInput = Partial<Omit<User, "id">>;

// Pick only safe fields for public display
type UserPreview = Pick<User, "id" | "name">;

// Record for role-based permissions map
type Role = "admin" | "editor" | "viewer";
const permissions: Record<Role, string[]> = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"],
};

/**
 * Creates a new user from input, assigning an auto-generated id.
 * @param input - User data without id.
 * @returns A complete User object.
 */
function createUser(input: CreateUserInput): User {
  return { id: Date.now(), ...input };
}

/**
 * Displays a user without allowing mutation (Readonly).
 * @param user - The user to display (read-only).
 */
function displayUser(user: Readonly<UserPreview>): void {
  console.log(`${user.id}: ${user.name}`);
  // user.name = "Hacked!"; // ❌ Cannot assign — Readonly
}

const newUser = createUser({
  name: "Alice",
  email: "alice@example.com",
  password: "secret",
});
displayUser({ id: newUser.id, name: newUser.name });

/*
  KEY TAKEAWAYS:
  ✅ Partial<T>   → all fields optional  (updates)
  ✅ Required<T>  → all fields required  (strict validation)
  ✅ Readonly<T>  → no mutations allowed (display, logging)
  ✅ Pick<T, K>   → keep only some keys  (previews, summaries)
  ✅ Omit<T, K>   → drop some keys       (hide sensitive data)
  ✅ Record<K, V> → object with known keys (maps, configs)
  ✅ Combine them for real patterns like CreateDTO / UpdateDTO
*/
