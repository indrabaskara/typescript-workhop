/**
 * 07 - LITERAL TYPES & ENUMS
 * Precise type definitions for specific values
 */

// ============================================
// 1. STRING LITERAL TYPES
// ============================================

// Exact string values
type Direction = "north" | "south" | "east" | "west";

function move(direction: Direction) {
  console.log(`Moving ${direction}`);
}

move("north"); // ✅ Valid
// move("up"); // ❌ Error: not in the literal union

// Combining with other types
type Status = "active" | "inactive" | "pending";
type Priority = "low" | "medium" | "high";

interface Task {
  id: number;
  title: string;
  status: Status;
  priority: Priority;
}

const task: Task = {
  id: 1,
  title: "Review PR",
  status: "pending",
  priority: "high",
};

// ============================================
// 2. NUMBER LITERAL TYPES
// ============================================

// Specific numbers only
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

function rollDice(): DiceRoll {
  return (Math.floor(Math.random() * 6) + 1) as DiceRoll;
}

// HTTP status codes
type SuccessCode = 200 | 201 | 204;
type ClientErrorCode = 400 | 401 | 403 | 404;
type ServerErrorCode = 500 | 502 | 503;
type HttpStatusCode = SuccessCode | ClientErrorCode | ServerErrorCode;

function handleStatus(code: HttpStatusCode) {
  if (code >= 200 && code < 300) {
    console.log("Success!");
  } else if (code >= 400 && code < 500) {
    console.log("Client error");
  } else {
    console.log("Server error");
  }
}

// ============================================
// 3. BOOLEAN LITERAL TYPES
// ============================================

// Specific boolean value
type AlwaysTrue = true;
type AlwaysFalse = false;

// Useful for function overloads
function createUser(admin: true): { name: string; isAdmin: true };
function createUser(admin: false): { name: string; isAdmin: false };
function createUser(admin: boolean): { name: string; isAdmin: boolean } {
  return { name: "User", isAdmin: admin };
}

const adminUser = createUser(true); // isAdmin is true (not just boolean)
const regularUser = createUser(false); // isAdmin is false

// ============================================
// 4. TEMPLATE LITERAL TYPES
// ============================================

// Combine string literals
type Color = "red" | "green" | "blue";
type Shade = "light" | "dark";
type ColorShade = `${Shade}-${Color}`;
// Results in: "light-red" | "light-green" | "light-blue" | "dark-red" | "dark-green" | "dark-blue"

const myColor: ColorShade = "dark-blue"; // ✅
// const invalid: ColorShade = "medium-red"; // ❌

// Event names
type EventName = "click" | "scroll" | "focus";
type EventHandler = `on${Capitalize<EventName>}`;
// Results in: "onClick" | "onScroll" | "onFocus"

// CSS properties
type CssUnit = "px" | "em" | "rem" | "%";
type Size = `${number}${CssUnit}`;

// This works at compile time but runtime validation needed
// const width: Size = "100px";

// ============================================
// 5. NUMERIC ENUMS
// ============================================

// Basic enum (auto-incrementing from 0)
enum UserRole {
  Guest,     // 0
  User,      // 1
  Moderator, // 2
  Admin,     // 3
}

function checkPermission(role: UserRole) {
  if (role >= UserRole.Moderator) {
    console.log("Has moderation permissions");
  } else {
    console.log("Limited permissions");
  }
}

checkPermission(UserRole.Admin);
checkPermission(UserRole.Guest);

// Enum with explicit values
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500,
}

function handleResponse(status: HttpStatus) {
  switch (status) {
    case HttpStatus.OK:
      console.log("Success!");
      break;
    case HttpStatus.NotFound:
      console.log("Resource not found");
      break;
    default:
      console.log(`Status: ${status}`);
  }
}

// ============================================
// 6. STRING ENUMS
// ============================================

// String enums (more readable in logs/debugging)
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warning = "WARNING",
  Error = "ERROR",
}

function log(message: string, level: LogLevel) {
  console.log(`[${level}] ${message}`);
}

log("Application started", LogLevel.Info);
log("Something went wrong", LogLevel.Error);

// String enum for API endpoints
enum ApiEndpoint {
  Users = "/api/users",
  Products = "/api/products",
  Orders = "/api/orders",
  Auth = "/api/auth",
}

async function fetchData(endpoint: ApiEndpoint) {
  const response = await fetch(`https://example.com${endpoint}`);
  return response.json();
}

// ============================================
// 7. CONST ENUMS (Compile-time only)
// ============================================

// Const enums are inlined at compile time (no runtime code)
const enum Environment {
  Development = "development",
  Staging = "staging",
  Production = "production",
}

function getConfig(env: Environment) {
  // At compile time, Environment.Production is replaced with "production"
  if (env === Environment.Production) {
    return { debug: false, apiUrl: "https://api.prod.com" };
  } else {
    return { debug: true, apiUrl: "https://api.dev.com" };
  }
}

// ============================================
// 8. ENUMS VS LITERAL TYPES - When to Use What
// ============================================

// ❌ DON'T use enum when literal type is better
enum BadButtonType {
  Primary = "primary",
  Secondary = "secondary",
}

// ✅ DO use literal type for simple string values
type ButtonType = "primary" | "secondary" | "danger" | "success";

// ✅ DO use enum when you need:
// - Numeric values with meaning
// - Reverse mapping (number to name)
// - Namespace grouping

enum FilePermission {
  Read = 4,
  Write = 2,
  Execute = 1,
}

// Can combine with bitwise operations
const readWrite = FilePermission.Read | FilePermission.Write; // 6

// Reverse mapping (only works with numeric enums)
console.log(FilePermission[4]); // "Read"

// ============================================
// 9. REAL-WORLD EXAMPLE: Order System
// ============================================

// Using literal types for order status
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

// Using enum for payment methods with specific codes
enum PaymentMethod {
  CreditCard = "CC",
  DebitCard = "DC",
  PayPal = "PP",
  BankTransfer = "BT",
  Cash = "CASH",
}

// Using enum for order priority (numeric makes sense)
enum OrderPriority {
  Low = 1,
  Normal = 2,
  High = 3,
  Urgent = 4,
}

interface Order {
  id: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  priority: OrderPriority;
  total: number;
  createdAt: Date;
}

function processOrder(order: Order): string {
  // Type-safe status check
  if (order.status === "cancelled") {
    return "Order was cancelled";
  }

  // Type-safe priority check
  if (order.priority >= OrderPriority.High) {
    return `Rush processing for order ${order.id}`;
  }

  // Type-safe payment method check
  switch (order.paymentMethod) {
    case PaymentMethod.CreditCard:
    case PaymentMethod.DebitCard:
      return "Processing card payment";
    case PaymentMethod.PayPal:
      return "Redirecting to PayPal";
    case PaymentMethod.BankTransfer:
      return "Awaiting bank transfer";
    case PaymentMethod.Cash:
      return "Cash on delivery";
    default:
      const _exhaustive: never = order.paymentMethod;
      return _exhaustive;
  }
}

const myOrder: Order = {
  id: "ORD-001",
  status: "processing",
  paymentMethod: PaymentMethod.CreditCard,
  priority: OrderPriority.Urgent,
  total: 299.99,
  createdAt: new Date(),
};

console.log(processOrder(myOrder));

// ============================================
// 10. REAL-WORLD EXAMPLE: Feature Flags
// ============================================

// Literal types for feature names
type FeatureName =
  | "dark-mode"
  | "new-dashboard"
  | "beta-features"
  | "advanced-analytics";

// Enum for environment
enum DeploymentEnvironment {
  Local = "local",
  Development = "development",
  Staging = "staging",
  Production = "production",
}

type FeatureConfig = {
  [K in FeatureName]: boolean;
};

const featureFlags: Record<DeploymentEnvironment, FeatureConfig> = {
  [DeploymentEnvironment.Local]: {
    "dark-mode": true,
    "new-dashboard": true,
    "beta-features": true,
    "advanced-analytics": true,
  },
  [DeploymentEnvironment.Development]: {
    "dark-mode": true,
    "new-dashboard": true,
    "beta-features": true,
    "advanced-analytics": false,
  },
  [DeploymentEnvironment.Staging]: {
    "dark-mode": true,
    "new-dashboard": true,
    "beta-features": false,
    "advanced-analytics": false,
  },
  [DeploymentEnvironment.Production]: {
    "dark-mode": true,
    "new-dashboard": false,
    "beta-features": false,
    "advanced-analytics": false,
  },
};

function isFeatureEnabled(
  feature: FeatureName,
  env: DeploymentEnvironment
): boolean {
  return featureFlags[env][feature];
}

// Usage
const canShowNewDashboard = isFeatureEnabled(
  "new-dashboard",
  DeploymentEnvironment.Production
);

// ============================================
// 11. AS CONST - Creating Literal Types from Objects
// ============================================

// Without as const - types are widened
const colors1 = {
  primary: "blue",
  secondary: "green",
}; // Type: { primary: string; secondary: string }

// With as const - literal types preserved
const colors2 = {
  primary: "blue",
  secondary: "green",
} as const; // Type: { readonly primary: "blue"; readonly secondary: "green" }

// Array with as const
const directions = ["north", "south", "east", "west"] as const;
type DirectionType = typeof directions[number]; // "north" | "south" | "east" | "west"

// Object to type
const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

type HttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS];
// "GET" | "POST" | "PUT" | "DELETE"

function request(method: HttpMethod, url: string) {
  console.log(`${method} ${url}`);
}

request(HTTP_METHODS.GET, "/api/users");

// ============================================
// 12. DISCRIMINATED UNIONS WITH LITERALS
// ============================================

interface SuccessResult {
  type: "success";
  data: string;
}

interface ErrorResult {
  type: "error";
  message: string;
  code: number;
}

interface LoadingResult {
  type: "loading";
}

type Result = SuccessResult | ErrorResult | LoadingResult;

function handleResult(result: Result) {
  // Type literal acts as discriminator
  switch (result.type) {
    case "success":
      console.log(`Data: ${result.data}`);
      break;
    case "error":
      console.log(`Error ${result.code}: ${result.message}`);
      break;
    case "loading":
      console.log("Loading...");
      break;
    default:
      const _exhaustive: never = result;
      return _exhaustive;
  }
}

// ============================================
// KEY TAKEAWAYS
// ============================================

/*
✅ Literal types - exact values, great for status/state
✅ Use string literals for simple value sets
✅ Use numeric enums when values have numeric meaning
✅ Use string enums for better debugging/logging
✅ Template literal types for combining string patterns
✅ as const - preserve literal types from objects/arrays
✅ Enums provide namespace and reverse mapping
✅ Literal types are often better than enums for simple cases
✅ Use discriminated unions with literal types for type-safe state
✅ Both approaches provide excellent autocomplete and type safety
*/
