/**
 * 03 - UNION & INTERSECTION TYPES
 * Combining types for flexible and precise type definitions
 */

// ============================================
// 1. UNION TYPES (OR)
// ============================================

// Basic union - value can be one type OR another
type StringOrNumber = string | number;

let id: StringOrNumber;
id = "abc123"; // ✅ Valid
id = 12345;    // ✅ Valid
// id = true;  // ❌ Error

// Union with literal types
type Status = "pending" | "approved" | "rejected";

function updateStatus(status: Status) {
  console.log(`Status updated to: ${status}`);
}

updateStatus("approved"); // ✅ Valid
// updateStatus("cancelled"); // ❌ Error: not in the union

// Union with multiple types
type Response = string | number | boolean | null;

// ============================================
// 2. INTERSECTION TYPES (AND)
// ============================================

// Basic intersection - combines multiple types
type HasName = { name: string };
type HasAge = { age: number };

type Person = HasName & HasAge;

const person: Person = {
  name: "John",
  age: 30,
  // Must have BOTH properties
};

// Combining interfaces with intersection
interface Timestamp {
  createdAt: Date;
  updatedAt: Date;
}

interface Author {
  authorId: string;
  authorName: string;
}

type Article = Timestamp & Author & {
  title: string;
  content: string;
};

const blogPost: Article = {
  title: "TypeScript Tips",
  content: "Here are some tips...",
  authorId: "user123",
  authorName: "Jane Doe",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ============================================
// 3. COMBINING UNIONS AND INTERSECTIONS
// ============================================

type Admin = {
  role: "admin";
  permissions: string[];
};

type User = {
  role: "user";
  limitedAccess: boolean;
};

type Guest = {
  role: "guest";
};

// Union of intersections
type AnyUser = Admin | User | Guest;

function handleUser(user: AnyUser) {
  if (user.role === "admin") {
    console.log("Admin permissions:", user.permissions);
  } else if (user.role === "user") {
    console.log("Limited access:", user.limitedAccess);
  } else {
    console.log("Guest user");
  }
}

// ============================================
// 4. REAL-WORLD EXAMPLE: Payment Processing
// ============================================

// Different payment method types
type CreditCard = {
  type: "credit_card";
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

type PayPal = {
  type: "paypal";
  email: string;
};

type BankTransfer = {
  type: "bank_transfer";
  accountNumber: string;
  routingNumber: string;
};

type Crypto = {
  type: "crypto";
  walletAddress: string;
  currency: "BTC" | "ETH" | "USDT";
};

// Union of all payment methods
type PaymentMethod = CreditCard | PayPal | BankTransfer | Crypto;

// Common payment details (intersection)
type PaymentDetails = {
  amount: number;
  currency: string;
  description: string;
};

type PaymentRequest = PaymentDetails & {
  method: PaymentMethod;
};

function processPayment(payment: PaymentRequest): string {
  console.log(`Processing payment of ${payment.amount} ${payment.currency}`);

  switch (payment.method.type) {
    case "credit_card":
      return `Charged card ending in ${payment.method.cardNumber.slice(-4)}`;
    case "paypal":
      return `PayPal payment from ${payment.method.email}`;
    case "bank_transfer":
      return `Bank transfer from account ${payment.method.accountNumber}`;
    case "crypto":
      return `Crypto payment of ${payment.method.currency} to ${payment.method.walletAddress}`;
    default:
      return "Unknown payment method";
  }
}

// Usage
const payment: PaymentRequest = {
  amount: 99.99,
  currency: "USD",
  description: "Premium subscription",
  method: {
    type: "credit_card",
    cardNumber: "4111111111111111",
    expiryDate: "12/25",
    cvv: "123",
  },
};

processPayment(payment);

// ============================================
// 5. REAL-WORLD EXAMPLE: API Responses
// ============================================

// Base response structure
type BaseResponse = {
  timestamp: Date;
  requestId: string;
};

// Success response
type SuccessResponse<T> = BaseResponse & {
  success: true;
  data: T;
};

// Error response
type ErrorResponse = BaseResponse & {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

// API response is either success or error
type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Example with user data
type UserData = {
  id: string;
  username: string;
  email: string;
};

async function fetchUser(userId: string): Promise<ApiResponse<UserData>> {
  try {
    // Simulated API call
    const userData: UserData = {
      id: userId,
      username: "johndoe",
      email: "john@example.com",
    };

    return {
      success: true,
      data: userData,
      timestamp: new Date(),
      requestId: "req_123",
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "USER_NOT_FOUND",
        message: "User not found",
        details: error,
      },
      timestamp: new Date(),
      requestId: "req_123",
    };
  }
}

// Handling the response
async function getUserProfile(userId: string) {
  const response = await fetchUser(userId);

  if (response.success) {
    // TypeScript knows response.data exists here
    console.log(`User: ${response.data.username}`);
    return response.data;
  } else {
    // TypeScript knows response.error exists here
    console.error(`Error: ${response.error.message}`);
    return null;
  }
}

// ============================================
// 6. PRACTICAL EXAMPLE: Form Validation
// ============================================

// Base validation rule
type BaseRule = {
  message: string;
};

// Different validation types
type RequiredRule = BaseRule & {
  type: "required";
};

type MinLengthRule = BaseRule & {
  type: "minLength";
  min: number;
};

type MaxLengthRule = BaseRule & {
  type: "maxLength";
  max: number;
};

type PatternRule = BaseRule & {
  type: "pattern";
  regex: RegExp;
};

type EmailRule = BaseRule & {
  type: "email";
};

// Union of all validation rules
type ValidationRule =
  | RequiredRule
  | MinLengthRule
  | MaxLengthRule
  | PatternRule
  | EmailRule;

// Field configuration with validation
type FieldConfig = {
  name: string;
  label: string;
  rules: ValidationRule[];
};

function validate(value: string, rules: ValidationRule[]): string[] {
  const errors: string[] = [];

  for (const rule of rules) {
    switch (rule.type) {
      case "required":
        if (!value || value.trim() === "") {
          errors.push(rule.message);
        }
        break;
      case "minLength":
        if (value.length < rule.min) {
          errors.push(rule.message);
        }
        break;
      case "maxLength":
        if (value.length > rule.max) {
          errors.push(rule.message);
        }
        break;
      case "pattern":
        if (!rule.regex.test(value)) {
          errors.push(rule.message);
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push(rule.message);
        }
        break;
    }
  }

  return errors;
}

// Usage
const emailField: FieldConfig = {
  name: "email",
  label: "Email Address",
  rules: [
    { type: "required", message: "Email is required" },
    { type: "email", message: "Please enter a valid email" },
    { type: "maxLength", max: 100, message: "Email is too long" },
  ],
};

const passwordField: FieldConfig = {
  name: "password",
  label: "Password",
  rules: [
    { type: "required", message: "Password is required" },
    { type: "minLength", min: 8, message: "Password must be at least 8 characters" },
    {
      type: "pattern",
      regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      message: "Password must contain letters and numbers",
    },
  ],
};

// Validate a password
const passwordErrors = validate("pass", passwordField.rules);
console.log(passwordErrors); // ["Password must be at least 8 characters", ...]

// ============================================
// KEY TAKEAWAYS
// ============================================

/*
✅ Union types (|) allow "this OR that" - value can be one of several types
✅ Intersection types (&) allow "this AND that" - combines multiple types
✅ Unions are perfect for values that can be different types
✅ Intersections are great for composing object types
✅ Combine unions and intersections for flexible, precise types
✅ Use discriminated unions (with 'type' field) for type-safe handling
*/
