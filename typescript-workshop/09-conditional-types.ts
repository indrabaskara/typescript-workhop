/**
 * 09 - CONDITIONAL TYPES
 * Dynamic type transformations based on conditions
 */

// ============================================
// 1. BASIC CONDITIONAL TYPES
// ============================================

// Syntax: T extends U ? X : Y
// If T is assignable to U, the type is X, otherwise Y

type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false
type C = IsString<"hello">; // true

// Practical example: Extract array element type
type ArrayElement<T> = T extends (infer U)[] ? U : T;

type StringArray = ArrayElement<string[]>;  // string
type NumberArray = ArrayElement<number[]>;  // number
type NotArray = ArrayElement<boolean>;      // boolean (no change)

// ============================================
// 2. CONDITIONAL TYPE CONSTRAINTS
// ============================================

// Return different types based on input
type MessageType<T extends string | number> = T extends string
  ? { text: T; length: number }
  : { value: T; double: number };

const stringMsg: MessageType<string> = {
  text: "hello",
  length: 5,
};

const numberMsg: MessageType<number> = {
  value: 42,
  double: 84,
};

// ============================================
// 3. INFER KEYWORD
// ============================================

// Infer (extract) types from complex types

// Extract return type from function
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: 1, name: "John" };
}

type UserType = GetReturnType<typeof getUser>;
// { id: number; name: string }

// Extract parameter types
type GetFirstParam<T> = T extends (first: infer F, ...args: any[]) => any
  ? F
  : never;

function greet(name: string, age: number) {
  return `Hello ${name}, you are ${age}`;
}

type FirstParamType = GetFirstParam<typeof greet>; // string

// Extract Promise value type
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type AsyncNumber = UnwrapPromise<Promise<number>>; // number
type SyncString = UnwrapPromise<string>;           // string

// ============================================
// 4. DISTRIBUTIVE CONDITIONAL TYPES
// ============================================

// When T is a union type, conditional types distribute over the union

type ToArray<T> = T extends any ? T[] : never;

type StrOrNum = ToArray<string | number>;
// Distributes to: ToArray<string> | ToArray<number>
// Result: string[] | number[]

// Non-distributive (using tuple to prevent distribution)
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type Combined = ToArrayNonDist<string | number>;
// Result: (string | number)[]

// ============================================
// 5. MAPPED TYPES WITH CONDITIONALS
// ============================================

// Make properties optional if they're functions
type OptionalFunctions<T> = {
  [K in keyof T]: T[K] extends Function ? T[K] | undefined : T[K];
};

interface User {
  name: string;
  age: number;
  greet: () => void;
  sayGoodbye: () => void;
}

type UserWithOptionalFunctions = OptionalFunctions<User>;
// {
//   name: string;
//   age: number;
//   greet: (() => void) | undefined;
//   sayGoodbye: (() => void) | undefined;
// }

// Extract only function properties
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type UserFunctions = FunctionPropertyNames<User>;
// "greet" | "sayGoodbye"

// Extract only non-function properties
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type UserData = NonFunctionPropertyNames<User>;
// "name" | "age"

// ============================================
// 6. REAL-WORLD EXAMPLE: API Response Types
// ============================================

// Automatically determine response type based on endpoint
type ApiEndpoints = {
  "/users": { id: number; name: string }[];
  "/posts": { id: number; title: string; content: string }[];
  "/comments": { id: number; text: string; userId: number }[];
};

type ApiResponse<T extends keyof ApiEndpoints> = {
  success: true;
  data: ApiEndpoints[T];
} | {
  success: false;
  error: string;
};

async function fetchApi<T extends keyof ApiEndpoints>(
  endpoint: T
): Promise<ApiResponse<T>> {
  // Simulated fetch
  return {
    success: true,
    data: [] as ApiEndpoints[T],
  };
}

// Usage with type inference
async function example() {
  const users = await fetchApi("/users");
  if (users.success) {
    // users.data is { id: number; name: string }[]
    users.data.forEach(user => console.log(user.name));
  }

  const posts = await fetchApi("/posts");
  if (posts.success) {
    // posts.data is { id: number; title: string; content: string }[]
    posts.data.forEach(post => console.log(post.title));
  }
}

// ============================================
// 7. FLATTEN NESTED TYPES
// ============================================

// Recursively flatten nested arrays
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;

type NestedArray = number[][][];
type Flattened = Flatten<NestedArray>; // number

type Mixed = Flatten<string[][]>; // string

// Flatten object one level
type FlattenObject<T> = T extends object
  ? { [K in keyof T]: T[K] }
  : T;

// ============================================
// 8. REAL-WORLD EXAMPLE: Form Field Types
// ============================================

// Determine input type based on field type
type FieldType = "text" | "number" | "email" | "checkbox" | "select";

type FieldValue<T extends FieldType> =
  T extends "number" ? number :
  T extends "checkbox" ? boolean :
  T extends "select" ? string :
  string;

interface FormField<T extends FieldType> {
  type: T;
  name: string;
  label: string;
  value: FieldValue<T>;
  required: boolean;
}

// Usage
const textField: FormField<"text"> = {
  type: "text",
  name: "username",
  label: "Username",
  value: "john_doe", // must be string
  required: true,
};

const numberField: FormField<"number"> = {
  type: "number",
  name: "age",
  label: "Age",
  value: 25, // must be number
  required: true,
};

const checkboxField: FormField<"checkbox"> = {
  type: "checkbox",
  name: "terms",
  label: "Accept Terms",
  value: true, // must be boolean
  required: true,
};

// ============================================
// 9. EXCLUDE NULL/UNDEFINED FROM PROPERTIES
// ============================================

// Remove null and undefined from all properties
type NoNullable<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

interface MaybeUser {
  name: string | null;
  email: string | undefined;
  age: number | null | undefined;
}

type DefiniteUser = NoNullable<MaybeUser>;
// {
//   name: string;
//   email: string;
//   age: number;
// }

// ============================================
// 10. DEEP READONLY
// ============================================

// Make all properties (including nested) readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

interface Config {
  api: {
    url: string;
    timeout: number;
    headers: {
      authorization: string;
    };
  };
  features: {
    darkMode: boolean;
  };
}

type ImmutableConfig = DeepReadonly<Config>;
// All properties at all levels are readonly

const config: ImmutableConfig = {
  api: {
    url: "https://api.example.com",
    timeout: 5000,
    headers: {
      authorization: "Bearer token",
    },
  },
  features: {
    darkMode: true,
  },
};

// config.api.url = "new"; // ❌ Error: readonly
// config.api.headers.authorization = "new"; // ❌ Error: readonly

// ============================================
// 11. PROMISE-LIKE TYPE DETECTION
// ============================================

// Check if type is a Promise or Promise-like
type IsPromise<T> = T extends Promise<any> ? true : false;

type A1 = IsPromise<Promise<string>>; // true
type B1 = IsPromise<string>;          // false

// Get Promise value or original type
type Awaitable<T> = T extends Promise<infer U> ? U : T;

type PromiseString = Awaitable<Promise<string>>; // string
type PlainNumber = Awaitable<number>;            // number

// ============================================
// 12. FUNCTION OVERLOAD HELPER
// ============================================

// Extract all overload signatures
type OverloadedReturnType<T> =
  T extends { (...args: any[]): infer R; (...args: any[]): infer R }
    ? R
    : T extends (...args: any[]) => infer R
    ? R
    : never;

// Create type-safe event emitter
type EventMap = {
  click: { x: number; y: number };
  keypress: { key: string };
  submit: { data: Record<string, any> };
};

type EventHandler<T extends keyof EventMap> = (
  event: EventMap[T]
) => void;

class TypedEmitter {
  on<T extends keyof EventMap>(event: T, handler: EventHandler<T>) {
    // Implementation
  }

  emit<T extends keyof EventMap>(event: T, data: EventMap[T]) {
    // Implementation
  }
}

const emitter = new TypedEmitter();

emitter.on("click", (e) => {
  // e is { x: number; y: number }
  console.log(e.x, e.y);
});

emitter.emit("click", { x: 10, y: 20 }); // ✅ Type-safe!
// emitter.emit("click", { x: 10 }); // ❌ Error: missing 'y'

// ============================================
// 13. REAL-WORLD: QUERY BUILDER TYPES
// ============================================

type QueryOperator = "eq" | "gt" | "lt" | "in" | "like";

type QueryValue<T, Op extends QueryOperator> =
  Op extends "in" ? T[] :
  Op extends "like" ? string :
  T;

interface WhereClause<T, K extends keyof T, Op extends QueryOperator> {
  field: K;
  operator: Op;
  value: QueryValue<T[K], Op>;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

// Usage - fully type-safe!
const query1: WhereClause<Product, "price", "gt"> = {
  field: "price",
  operator: "gt",
  value: 100, // must be number
};

const query2: WhereClause<Product, "category", "in"> = {
  field: "category",
  operator: "in",
  value: ["electronics", "books"], // must be string[]
};

const query3: WhereClause<Product, "name", "like"> = {
  field: "name",
  operator: "like",
  value: "%laptop%", // must be string
};

// ============================================
// 14. ADVANCED: REQUIRED KEYS
// ============================================

// Extract keys that are required (not optional)
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

// Extract keys that are optional
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

interface Mixed {
  required1: string;
  required2: number;
  optional1?: boolean;
  optional2?: Date;
}

type ReqKeys = RequiredKeys<Mixed>; // "required1" | "required2"
type OptKeys = OptionalKeys<Mixed>; // "optional1" | "optional2"

// ============================================
// KEY TAKEAWAYS
// ============================================

/*
✅ Conditional types use: T extends U ? X : Y
✅ 'infer' keyword extracts types from complex structures
✅ Conditional types distribute over union types
✅ Use conditionals to create dynamic, flexible types
✅ Combine with mapped types for powerful transformations
✅ Perfect for library authors and advanced type safety
✅ Real-world uses: API clients, form handlers, query builders
*/
