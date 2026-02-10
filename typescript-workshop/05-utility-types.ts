/**
 * 05 - UTILITY TYPES
 * TypeScript's built-in utility types for common type transformations
 */

// ============================================
// 1. PARTIAL<T> - Makes all properties optional
// ============================================

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Update function that accepts partial updates
function updateUser(id: number, updates: Partial<User>): User {
  // Fetch existing user (simulated)
  const existingUser: User = {
    id,
    name: "John Doe",
    email: "john@example.com",
    age: 30,
  };

  // Merge updates
  return { ...existingUser, ...updates };
}

// Can update just one field
updateUser(1, { name: "Jane Doe" });
updateUser(1, { email: "jane@example.com", age: 25 });

// ============================================
// 2. REQUIRED<T> - Makes all properties required
// ============================================

interface Config {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

// Function that needs all config values
function validateConfig(config: Required<Config>): boolean {
  // All properties are guaranteed to exist
  return (
    config.apiUrl.length > 0 && config.timeout > 0 && config.retries >= 0
  );
}

const fullConfig: Required<Config> = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
};

// ============================================
// 3. READONLY<T> - Makes all properties readonly
// ============================================

interface Product {
  id: string;
  name: string;
  price: number;
}

function displayProduct(product: Readonly<Product>): void {
  console.log(product.name);
  // product.price = 100; // ❌ Error: Cannot assign to 'price' because it is read-only
}

// Useful for preventing mutations
const immutableProduct: Readonly<Product> = {
  id: "prod_123",
  name: "Laptop",
  price: 999,
};

// ============================================
// 4. PICK<T, K> - Select specific properties
// ============================================

interface Employee {
  id: number;
  name: string;
  email: string;
  salary: number;
  department: string;
  startDate: Date;
}

// Only expose safe fields publicly
type PublicEmployee = Pick<Employee, "id" | "name" | "department">;

function getPublicProfile(employee: Employee): PublicEmployee {
  return {
    id: employee.id,
    name: employee.name,
    department: employee.department,
  };
}

const publicProfile: PublicEmployee = {
  id: 1,
  name: "Alice",
  department: "Engineering",
  // salary is not accessible
};

// ============================================
// 5. OMIT<T, K> - Exclude specific properties
// ============================================

// Create a type without sensitive fields
type EmployeeWithoutSalary = Omit<Employee, "salary">;

// Useful for create operations (omit id)
type CreateEmployeeDTO = Omit<Employee, "id" | "startDate">;

function createEmployee(data: CreateEmployeeDTO): Employee {
  return {
    id: Math.random(),
    startDate: new Date(),
    ...data,
  };
}

const newEmployee = createEmployee({
  name: "Bob",
  email: "bob@example.com",
  salary: 75000,
  department: "Sales",
});

// ============================================
// 6. RECORD<K, T> - Create object type with specific keys
// ============================================

// Map of keys to specific value type
type Role = "admin" | "user" | "guest";

type RolePermissions = Record<Role, string[]>;

const permissions: RolePermissions = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"],
};

// Dynamic object with string keys
type UserCache = Record<string, User>;

const cache: UserCache = {
  user_1: { id: 1, name: "Alice", email: "alice@example.com", age: 25 },
  user_2: { id: 2, name: "Bob", email: "bob@example.com", age: 30 },
};

// HTTP status codes
type HttpStatusCode = 200 | 201 | 400 | 401 | 404 | 500;
type StatusMessages = Record<HttpStatusCode, string>;

const statusMessages: StatusMessages = {
  200: "OK",
  201: "Created",
  400: "Bad Request",
  401: "Unauthorized",
  404: "Not Found",
  500: "Internal Server Error",
};

// ============================================
// 7. EXCLUDE<T, U> - Exclude types from union
// ============================================

type AllStatus = "pending" | "approved" | "rejected" | "deleted";

// Remove "deleted" from the union
type ActiveStatus = Exclude<AllStatus, "deleted">;

const status: ActiveStatus = "pending"; // ✅
// const deleted: ActiveStatus = "deleted"; // ❌ Error

// Exclude multiple types
type StringOrNumber = string | number | boolean;
type OnlyString = Exclude<StringOrNumber, number | boolean>; // string

// ============================================
// 8. EXTRACT<T, U> - Extract types from union
// ============================================

type AllTypes = string | number | boolean | null | undefined;

// Extract only primitive types
type OnlyPrimitives = Extract<AllTypes, string | number | boolean>; // string | number | boolean

type Event = "click" | "scroll" | "mousemove" | "keydown";
type MouseEvent = Extract<Event, `mouse${string}`>; // "mousemove"

// ============================================
// 9. NONNULLABLE<T> - Exclude null and undefined
// ============================================

type MaybeString = string | null | undefined;

type DefinitelyString = NonNullable<MaybeString>; // string

function processValue(value: NonNullable<MaybeString>): number {
  // value is guaranteed to be string (not null or undefined)
  return value.length;
}

// ============================================
// 10. RETURNTYPE<T> - Extract function return type
// ============================================

function getUser() {
  return {
    id: 1,
    name: "John",
    email: "john@example.com",
  };
}

// Extract the return type automatically
type UserReturnType = ReturnType<typeof getUser>;
// Same as: { id: number; name: string; email: string }

function processUser(user: UserReturnType) {
  console.log(user.name);
}

// ============================================
// 11. PARAMETERS<T> - Extract function parameters
// ============================================

function createProduct(name: string, price: number, inStock: boolean) {
  return { name, price, inStock };
}

// Extract parameter types as tuple
type CreateProductParams = Parameters<typeof createProduct>;
// [string, number, boolean]

function logProductCreation(...args: CreateProductParams) {
  console.log("Creating product with:", args);
  createProduct(...args);
}

// ============================================
// 12. AWAITED<T> - Unwrap Promise type
// ============================================

async function fetchData(): Promise<{ id: number; data: string }> {
  return { id: 1, data: "Hello" };
}

// Extract the resolved type from Promise
type FetchDataResult = Awaited<ReturnType<typeof fetchData>>;
// { id: number; data: string }

async function processData() {
  const result: FetchDataResult = await fetchData();
  console.log(result.data);
}

// Nested promises
type NestedPromise = Promise<Promise<string>>;
type Unwrapped = Awaited<NestedPromise>; // string

// ============================================
// 13. REAL-WORLD EXAMPLE: API Response Handler
// ============================================

// Original API response interface
interface ApiUser {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// Public user (exclude sensitive fields)
type PublicUser = Omit<ApiUser, "password" | "deletedAt">;

// User creation payload (exclude auto-generated fields)
type CreateUserPayload = Omit<ApiUser, "id" | "createdAt" | "updatedAt" | "deletedAt">;

// User update payload (all fields optional, exclude id)
type UpdateUserPayload = Partial<Omit<ApiUser, "id" | "createdAt" | "updatedAt">>;

// User with only required fields
type MinimalUser = Pick<ApiUser, "id" | "username">;

class UserService {
  async getPublicUser(id: number): Promise<PublicUser> {
    // Simulated API call
    return {
      id,
      username: "johndoe",
      email: "john@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async createUser(payload: CreateUserPayload): Promise<ApiUser> {
    // Simulated user creation
    return {
      id: Math.random(),
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  }

  async updateUser(id: number, payload: UpdateUserPayload): Promise<ApiUser> {
    // Simulated update
    const existing = await this.getPublicUser(id);
    return {
      ...(existing as ApiUser),
      ...payload,
      updatedAt: new Date(),
    };
  }
}

// Usage
const userService = new UserService();

async function example() {
  // Create user - only provide necessary fields
  const newUser = await userService.createUser({
    username: "newuser",
    email: "new@example.com",
    password: "secret123",
  });

  // Update user - all fields optional
  await userService.updateUser(1, { email: "updated@example.com" });
  await userService.updateUser(1, { username: "updatedname", email: "new@example.com" });
}

// ============================================
// 14. COMBINING UTILITY TYPES
// ============================================

interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Create: omit auto-generated fields, make published optional
type CreatePostDTO = Partial<Pick<BlogPost, "published">> &
  Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "published">;

// Update: all fields optional except id is omitted
type UpdatePostDTO = Partial<Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "authorId">>;

// List view: only show subset of fields
type PostSummary = Pick<BlogPost, "id" | "title" | "authorId" | "createdAt"> &
  Readonly<{ excerpt: string }>;

const createPost: CreatePostDTO = {
  title: "TypeScript Tips",
  content: "Here are some tips...",
  authorId: "user_123",
  tags: ["typescript", "programming"],
  // published is optional, id/dates are auto-generated
};

const updatePost: UpdatePostDTO = {
  title: "Updated Title",
  // Only updating title
};

// ============================================
// 15. CUSTOM UTILITY TYPE EXAMPLE
// ============================================

// Make specific keys optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make specific keys required
type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Make phone and address optional
type ContactForm = PartialBy<FormData, "phone" | "address">;

const contact: ContactForm = {
  name: "John",
  email: "john@example.com",
  // phone and address are optional
};

// ============================================
// KEY TAKEAWAYS
// ============================================

/*
✅ Partial<T> - Make all properties optional (great for updates)
✅ Required<T> - Make all properties required
✅ Readonly<T> - Make all properties read-only (prevent mutations)
✅ Pick<T, K> - Select specific properties
✅ Omit<T, K> - Exclude specific properties
✅ Record<K, T> - Create object type with specific keys
✅ Exclude<T, U> - Remove types from union
✅ Extract<T, U> - Extract types from union
✅ ReturnType<T> - Get function return type
✅ Parameters<T> - Get function parameter types
✅ Awaited<T> - Unwrap Promise types
✅ Combine utilities for complex transformations
✅ Utility types reduce boilerplate and increase type safety
*/
