// ============================================
// 05 - UTILITY TYPES
// ============================================

// Starting point: a simple User
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// --- Partial<T> — makes all fields optional ---
// Great for update functions where you only change some fields

function updateUser(id: number, updates: Partial<User>) {
  console.log(`Updating user ${id}`, updates);
}

updateUser(1, { name: "Alice" }); // ✅ only updating name
updateUser(1, { email: "a@b.com", name: "Bob" }); // ✅ two fields

// --- Required<T> — makes all fields required ---
// Opposite of Partial

interface Settings {
  theme?: string;
  language?: string;
  notifications?: boolean;
}

// Force all settings to be filled before saving
function saveSettings(settings: Required<Settings>) {
  console.log(settings.theme); // guaranteed to exist
}

saveSettings({ theme: "dark", language: "en", notifications: true }); // ✅
// saveSettings({ theme: "dark" }); // ❌ missing fields

// --- Readonly<T> — prevents modification ---

function displayUser(user: Readonly<User>) {
  console.log(user.name);
  // user.name = "Hacked!"; // ❌ Cannot assign to 'name'
}

// --- Pick<T, Keys> — keep only certain fields ---

type UserPreview = Pick<User, "id" | "name">;

const preview: UserPreview = {
  id: 1,
  name: "Alice",
  // email and password are NOT available
};

// --- Omit<T, Keys> — remove certain fields ---

type PublicUser = Omit<User, "password">;

const publicUser: PublicUser = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  // no password — safely excluded
};

// --- Record<Keys, ValueType> — create an object type ---

type Role = "admin" | "editor" | "viewer";

const permissions: Record<Role, string[]> = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"],
};

// --- Combining them (the real power) ---

// "Create" DTO: no id (auto-generated), no password hash
type CreateUserInput = Omit<User, "id">;

// "Update" DTO: all optional, but can't change id
type UpdateUserInput = Partial<Omit<User, "id">>;

function createUser(input: CreateUserInput): User {
  return { id: Date.now(), ...input };
}

function patchUser(id: number, input: UpdateUserInput): void {
  console.log(`Patching user ${id}`, input);
}

createUser({ name: "Bob", email: "bob@b.com", password: "secret" }); // ✅
patchUser(1, { email: "new@email.com" }); // ✅ only update email

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
