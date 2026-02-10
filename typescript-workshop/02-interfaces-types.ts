/**
 * 02 - INTERFACES vs TYPES
 * Understanding when to use each and their differences
 */

// ============================================
// 1. INTERFACE BASICS
// ============================================

// Interface for object shape
interface User {
  id: number;
  name: string;
  email: string;
}

// Interface can be extended
interface Admin extends User {
  permissions: string[];
  role: "admin" | "superadmin";
}

const admin: Admin = {
  id: 1,
  name: "Admin User",
  email: "admin@example.com",
  permissions: ["read", "write", "delete"],
  role: "admin",
};

// ============================================
// 2. TYPE ALIAS BASICS
// ============================================

// Type alias for object shape
type Product = {
  id: number;
  name: string;
  price: number;
};

// Type can be extended using intersection (&)
type DigitalProduct = Product & {
  downloadUrl: string;
  fileSize: number;
};

const ebook: DigitalProduct = {
  id: 101,
  name: "TypeScript Guide",
  price: 29.99,
  downloadUrl: "https://example.com/download/ts-guide",
  fileSize: 1024,
};

// ============================================
// 3. KEY DIFFERENCES
// ============================================

// Interface: Can be declared multiple times (declaration merging)
interface Window {
  title: string;
}

interface Window {
  width: number;
}

// Both declarations merge into one
const myWindow: Window = {
  title: "My App",
  width: 1920,
};

// Type: Cannot be declared multiple times
// type Product = { sku: string }; // ❌ Error: Duplicate identifier

// Type: Can use unions, primitives, tuples
type Status = "pending" | "approved" | "rejected";
type ID = string | number;
type Coordinates = [number, number];

// Interface: Cannot use unions directly
// interface Status = "pending" | "approved"; // ❌ Error

// ============================================
// 4. WHEN TO USE WHICH?
// ============================================

// ✅ USE INTERFACE for:
// - Object shapes and class contracts
// - When you might need declaration merging
// - Public APIs that others might extend

interface ApiResponse {
  status: number;
  data: any;
}

interface ErrorResponse extends ApiResponse {
  error: string;
}

// ✅ USE TYPE for:
// - Unions and intersections
// - Tuples and primitives
// - Complex type transformations

type Result<T> = { success: true; data: T } | { success: false; error: string };

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type Point = [number, number];

// ============================================
// 5. REAL-WORLD EXAMPLE: API Client
// ============================================

// Interface for the base entity
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for a blog post
interface BlogPost extends BaseEntity {
  title: string;
  content: string;
  author: string;
  published: boolean;
}

// Type for API response (uses union)
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: number };

// Type for request methods
type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// Interface for API client configuration
interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Function using these types
async function fetchBlogPost(id: string): Promise<ApiResult<BlogPost>> {
  try {
    // Simulated API call
    const post: BlogPost = {
      id,
      title: "Understanding TypeScript",
      content: "TypeScript is a typed superset of JavaScript...",
      author: "Jane Developer",
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return { success: true, data: post };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch blog post",
      code: 500,
    };
  }
}

// ============================================
// 6. PRACTICAL EXAMPLE: Form Handling
// ============================================

// Base form field interface
interface FormField {
  name: string;
  label: string;
  required: boolean;
}

// Extend for different field types
interface TextField extends FormField {
  type: "text" | "email" | "password";
  maxLength?: number;
}

interface SelectField extends FormField {
  type: "select";
  options: Array<{ value: string; label: string }>;
}

interface CheckboxField extends FormField {
  type: "checkbox";
  defaultChecked?: boolean;
}

// Union type for any field
type AnyFormField = TextField | SelectField | CheckboxField;

// Form configuration
interface FormConfig {
  fields: AnyFormField[];
  submitUrl: string;
  method: RequestMethod;
}

const loginForm: FormConfig = {
  fields: [
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      maxLength: 100,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
    },
    {
      name: "remember",
      label: "Remember Me",
      type: "checkbox",
      required: false,
      defaultChecked: false,
    },
  ],
  submitUrl: "/api/login",
  method: "POST",
};

// ============================================
// KEY TAKEAWAYS
// ============================================

/*
✅ Use INTERFACE for object shapes and when you need inheritance
✅ Use TYPE for unions, tuples, and complex type compositions
✅ Both can be used interchangeably for simple object types
✅ Interfaces support declaration merging, types don't
✅ In practice: interface for public APIs, type for internal logic
✅ Consistency matters - pick one style and stick with it in your project
*/
