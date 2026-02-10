/**
 * 04 - GENERICS
 * Writing reusable, type-safe code that works with multiple types
 */

// ============================================
// 1. BASIC GENERICS
// ============================================

// Without generics - not reusable
function getFirstNumber(arr: number[]): number {
  return arr[0];
}

function getFirstString(arr: string[]): string {
  return arr[0];
}

// With generics - works with any type!
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

// TypeScript infers the type
const firstNum = getFirst([1, 2, 3]); // T is number
const firstName = getFirst(["Alice", "Bob"]); // T is string
const firstBool = getFirst([true, false]); // T is boolean

// You can also explicitly specify the type
const firstExplicit = getFirst<string>(["hello"]);

// ============================================
// 2. GENERIC INTERFACES
// ============================================

// Generic interface for API responses
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Use with different data types
const userResponse: ApiResponse<{ id: number; name: string }> = {
  data: { id: 1, name: "John" },
  status: 200,
  message: "Success",
};

const productResponse: ApiResponse<{ id: string; price: number }> = {
  data: { id: "prod_123", price: 99.99 },
  status: 200,
  message: "Success",
};

// ============================================
// 3. GENERIC CLASSES
// ============================================

// Generic class for a data store
class DataStore<T> {
  private data: T[] = [];

  add(item: T): void {
    this.data.push(item);
  }

  get(index: number): T | undefined {
    return this.data[index];
  }

  getAll(): T[] {
    return [...this.data];
  }

  remove(index: number): T | undefined {
    return this.data.splice(index, 1)[0];
  }

  find(predicate: (item: T) => boolean): T | undefined {
    return this.data.find(predicate);
  }
}

// Usage with different types
const numberStore = new DataStore<number>();
numberStore.add(1);
numberStore.add(2);
numberStore.add(3);
console.log(numberStore.getAll()); // [1, 2, 3]

const userStore = new DataStore<{ id: number; name: string }>();
userStore.add({ id: 1, name: "Alice" });
userStore.add({ id: 2, name: "Bob" });
const alice = userStore.find((user) => user.name === "Alice");

// ============================================
// 4. MULTIPLE TYPE PARAMETERS
// ============================================

// Function with multiple generic types
function pair<K, V>(key: K, value: V): { key: K; value: V } {
  return { key, value };
}

const stringNumber = pair("age", 25); // { key: string, value: number }
const numberBoolean = pair(1, true); // { key: number, value: boolean }

// Generic Map-like structure
class KeyValueStore<K, V> {
  private store = new Map<K, V>();

  set(key: K, value: V): void {
    this.store.set(key, value);
  }

  get(key: K): V | undefined {
    return this.store.get(key);
  }

  has(key: K): boolean {
    return this.store.has(key);
  }

  delete(key: K): boolean {
    return this.store.delete(key);
  }
}

const cache = new KeyValueStore<string, number>();
cache.set("count", 42);
console.log(cache.get("count")); // 42

// ============================================
// 5. GENERIC CONSTRAINTS
// ============================================

// Constrain generic to types with specific properties
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): void {
  console.log(`Length: ${item.length}`);
}

logLength("hello"); // ✅ string has length
logLength([1, 2, 3]); // ✅ array has length
logLength({ length: 10 }); // ✅ object with length property
// logLength(123); // ❌ Error: number doesn't have length

// Constrain to specific types
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: "John" }, { age: 30 });
console.log(merged); // { name: "John", age: 30 }

// ============================================
// 6. REAL-WORLD EXAMPLE: API Client
// ============================================

// Generic API client for different endpoints
class ApiClient<T> {
  constructor(private baseUrl: string, private endpoint: string) {}

  async getAll(): Promise<T[]> {
    const response = await fetch(`${this.baseUrl}${this.endpoint}`);
    return response.json();
  }

  async getById(id: string | number): Promise<T> {
    const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`);
    return response.json();
  }

  async create(data: Omit<T, "id">): Promise<T> {
    const response = await fetch(`${this.baseUrl}${this.endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async delete(id: string | number): Promise<void> {
    await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
      method: "DELETE",
    });
  }
}

// Define types for different resources
type User = {
  id: number;
  name: string;
  email: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
};

// Create clients for different resources
const userClient = new ApiClient<User>("https://api.example.com", "/users");
const productClient = new ApiClient<Product>("https://api.example.com", "/products");

// Type-safe usage
async function example() {
  const users = await userClient.getAll(); // Type: User[]
  const user = await userClient.getById(1); // Type: User
  const newUser = await userClient.create({
    name: "Jane",
    email: "jane@example.com",
  });

  const products = await productClient.getAll(); // Type: Product[]
  const product = await productClient.getById("prod_123"); // Type: Product
}

// ============================================
// 7. REAL-WORLD EXAMPLE: Form State Manager
// ============================================

// Generic form state manager
class FormState<T extends Record<string, any>> {
  private values: T;
  private errors: Partial<Record<keyof T, string>> = {};
  private touched: Partial<Record<keyof T, boolean>> = {};

  constructor(initialValues: T) {
    this.values = { ...initialValues };
  }

  getValue<K extends keyof T>(field: K): T[K] {
    return this.values[field];
  }

  setValue<K extends keyof T>(field: K, value: T[K]): void {
    this.values[field] = value;
    this.touched[field] = true;
  }

  getValues(): T {
    return { ...this.values };
  }

  setError<K extends keyof T>(field: K, error: string): void {
    this.errors[field] = error;
  }

  getError<K extends keyof T>(field: K): string | undefined {
    return this.errors[field];
  }

  clearError<K extends keyof T>(field: K): void {
    delete this.errors[field];
  }

  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  isTouched<K extends keyof T>(field: K): boolean {
    return this.touched[field] || false;
  }

  reset(values?: T): void {
    this.values = values || ({} as T);
    this.errors = {};
    this.touched = {};
  }
}

// Usage with a login form
type LoginForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const loginForm = new FormState<LoginForm>({
  email: "",
  password: "",
  rememberMe: false,
});

loginForm.setValue("email", "user@example.com");
loginForm.setValue("password", "secret123");

if (loginForm.getValue("email").length === 0) {
  loginForm.setError("email", "Email is required");
}

console.log(loginForm.getValues());
console.log(loginForm.hasErrors());

// ============================================
// 8. DEFAULT GENERIC TYPES
// ============================================

// Generic with default type
interface Container<T = string> {
  value: T;
  timestamp: Date;
}

const stringContainer: Container = {
  value: "hello", // defaults to string
  timestamp: new Date(),
};

const numberContainer: Container<number> = {
  value: 42,
  timestamp: new Date(),
};

// ============================================
// 9. GENERIC UTILITY FUNCTION EXAMPLES
// ============================================

// Array operations
function groupBy<T, K extends keyof any>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const key = getKey(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

// Usage
const users = [
  { name: "Alice", age: 25, role: "admin" },
  { name: "Bob", age: 30, role: "user" },
  { name: "Charlie", age: 25, role: "user" },
];

const byAge = groupBy(users, (user) => user.age);
// { 25: [Alice, Charlie], 30: [Bob] }

const byRole = groupBy(users, (user) => user.role);
// { admin: [Alice], user: [Bob, Charlie] }

// Filter with type guard
function filterByType<T, S extends T>(
  array: T[],
  predicate: (item: T) => item is S
): S[] {
  return array.filter(predicate);
}

// ============================================
// KEY TAKEAWAYS
// ============================================

/*
✅ Generics make code reusable across different types
✅ Use <T> syntax to create a generic type parameter
✅ TypeScript can infer generic types from usage
✅ Use constraints (extends) to limit what types can be used
✅ Generic classes and interfaces enable type-safe data structures
✅ Multiple type parameters allow complex relationships
✅ Real-world use: API clients, form handlers, data stores
*/
