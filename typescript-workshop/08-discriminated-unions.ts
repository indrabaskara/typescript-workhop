/**
 * 08 - DISCRIMINATED UNIONS
 * Type-safe state management and pattern matching
 */

// ============================================
// 1. BASIC DISCRIMINATED UNION
// ============================================

// Each type has a common discriminant property ("type")
interface LoadingState {
  type: "loading";
}

interface SuccessState {
  type: "success";
  data: string;
}

interface ErrorState {
  type: "error";
  error: string;
}

type RequestState = LoadingState | SuccessState | ErrorState;

// Type-safe handling using the discriminant
function handleRequest(state: RequestState) {
  switch (state.type) {
    case "loading":
      return "Loading...";
    case "success":
      return `Data: ${state.data}`;
    case "error":
      return `Error: ${state.error}`;
  }
}

// ============================================
// 2. EXHAUSTIVENESS CHECKING
// ============================================

// TypeScript ensures all cases are handled
function getStateMessage(state: RequestState): string {
  switch (state.type) {
    case "loading":
      return "Please wait...";
    case "success":
      return "Request completed!";
    case "error":
      return "Something went wrong";
    default:
      // If we add a new state type and forget to handle it,
      // TypeScript will error here
      const _exhaustive: never = state;
      return _exhaustive;
  }
}

// ============================================
// 3. REAL-WORLD EXAMPLE: Payment Status
// ============================================

interface PendingPayment {
  status: "pending";
  orderId: string;
  amount: number;
}

interface ProcessingPayment {
  status: "processing";
  orderId: string;
  amount: number;
  transactionId: string;
}

interface CompletedPayment {
  status: "completed";
  orderId: string;
  amount: number;
  transactionId: string;
  completedAt: Date;
}

interface FailedPayment {
  status: "failed";
  orderId: string;
  amount: number;
  reason: string;
  failedAt: Date;
}

interface RefundedPayment {
  status: "refunded";
  orderId: string;
  amount: number;
  transactionId: string;
  refundedAt: Date;
  refundReason: string;
}

type Payment =
  | PendingPayment
  | ProcessingPayment
  | CompletedPayment
  | FailedPayment
  | RefundedPayment;

// Type-safe payment processing
function processPayment(payment: Payment): string {
  switch (payment.status) {
    case "pending":
      return `Order ${payment.orderId} is awaiting payment of $${payment.amount}`;

    case "processing":
      return `Processing payment ${payment.transactionId} for order ${payment.orderId}`;

    case "completed":
      return `Payment completed on ${payment.completedAt.toDateString()}`;

    case "failed":
      return `Payment failed: ${payment.reason}`;

    case "refunded":
      return `Refunded $${payment.amount}. Reason: ${payment.refundReason}`;

    default:
      const _exhaustive: never = payment;
      return _exhaustive;
  }
}

// Can only refund completed payments
function refundPayment(payment: Payment): RefundedPayment | null {
  if (payment.status !== "completed") {
    console.log("Can only refund completed payments");
    return null;
  }

  // TypeScript knows payment is CompletedPayment here
  return {
    status: "refunded",
    orderId: payment.orderId,
    amount: payment.amount,
    transactionId: payment.transactionId,
    refundedAt: new Date(),
    refundReason: "Customer request",
  };
}

// ============================================
// 4. REAL-WORLD EXAMPLE: UI Components
// ============================================

interface Button {
  type: "button";
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

interface Input {
  type: "input";
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

interface Checkbox {
  type: "checkbox";
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface Select {
  type: "select";
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}

type FormField = Button | Input | Checkbox | Select;

function renderField(field: FormField): string {
  switch (field.type) {
    case "button":
      return `<button class="${field.variant || "primary"}">${field.label}</button>`;

    case "input":
      return `<input type="text" placeholder="${field.placeholder}" value="${field.value}" />`;

    case "checkbox":
      return `<input type="checkbox" ${field.checked ? "checked" : ""} /> ${field.label}`;

    case "select":
      const options = field.options
        .map((opt) => `<option value="${opt.value}">${opt.label}</option>`)
        .join("");
      return `<select>${options}</select>`;

    default:
      const _exhaustive: never = field;
      return _exhaustive;
  }
}

// ============================================
// 5. REAL-WORLD EXAMPLE: API Actions
// ============================================

interface FetchUsersAction {
  type: "FETCH_USERS";
  payload: {
    page: number;
    limit: number;
  };
}

interface CreateUserAction {
  type: "CREATE_USER";
  payload: {
    name: string;
    email: string;
  };
}

interface UpdateUserAction {
  type: "UPDATE_USER";
  payload: {
    id: number;
    updates: {
      name?: string;
      email?: string;
    };
  };
}

interface DeleteUserAction {
  type: "DELETE_USER";
  payload: {
    id: number;
  };
}

type UserAction =
  | FetchUsersAction
  | CreateUserAction
  | UpdateUserAction
  | DeleteUserAction;

// Type-safe action handler (like Redux reducer)
function handleUserAction(action: UserAction): void {
  switch (action.type) {
    case "FETCH_USERS":
      console.log(`Fetching page ${action.payload.page} with limit ${action.payload.limit}`);
      break;

    case "CREATE_USER":
      console.log(`Creating user: ${action.payload.name} (${action.payload.email})`);
      break;

    case "UPDATE_USER":
      console.log(`Updating user ${action.payload.id}`);
      break;

    case "DELETE_USER":
      console.log(`Deleting user ${action.payload.id}`);
      break;

    default:
      const _exhaustive: never = action;
      return _exhaustive;
  }
}

// Action creators with perfect type safety
function fetchUsers(page: number, limit: number): FetchUsersAction {
  return {
    type: "FETCH_USERS",
    payload: { page, limit },
  };
}

function createUser(name: string, email: string): CreateUserAction {
  return {
    type: "CREATE_USER",
    payload: { name, email },
  };
}

// ============================================
// 6. NESTED DISCRIMINATED UNIONS
// ============================================

interface EmailNotification {
  method: "email";
  to: string;
  subject: string;
  body: string;
}

interface SMSNotification {
  method: "sms";
  phoneNumber: string;
  message: string;
}

interface PushNotification {
  method: "push";
  deviceId: string;
  title: string;
  body: string;
}

type NotificationMethod = EmailNotification | SMSNotification | PushNotification;

interface ScheduledNotification {
  type: "scheduled";
  scheduledFor: Date;
  notification: NotificationMethod;
}

interface ImmediateNotification {
  type: "immediate";
  notification: NotificationMethod;
}

type Notification = ScheduledNotification | ImmediateNotification;

function sendNotification(notification: Notification): void {
  if (notification.type === "scheduled") {
    console.log(`Scheduling for ${notification.scheduledFor.toISOString()}`);
  }

  const method = notification.notification;

  switch (method.method) {
    case "email":
      console.log(`Sending email to ${method.to}: ${method.subject}`);
      break;

    case "sms":
      console.log(`Sending SMS to ${method.phoneNumber}: ${method.message}`);
      break;

    case "push":
      console.log(`Sending push to device ${method.deviceId}: ${method.title}`);
      break;

    default:
      const _exhaustive: never = method;
      return _exhaustive;
  }
}

// ============================================
// 7. REAL-WORLD EXAMPLE: HTTP Responses
// ============================================

interface OkResponse<T> {
  status: 200;
  data: T;
}

interface CreatedResponse<T> {
  status: 201;
  data: T;
  location: string;
}

interface NoContentResponse {
  status: 204;
}

interface BadRequestResponse {
  status: 400;
  errors: Array<{ field: string; message: string }>;
}

interface UnauthorizedResponse {
  status: 401;
  message: string;
}

interface NotFoundResponse {
  status: 404;
  message: string;
}

interface ServerErrorResponse {
  status: 500;
  message: string;
  stack?: string;
}

type HttpResponse<T> =
  | OkResponse<T>
  | CreatedResponse<T>
  | NoContentResponse
  | BadRequestResponse
  | UnauthorizedResponse
  | NotFoundResponse
  | ServerErrorResponse;

function handleHttpResponse<T>(response: HttpResponse<T>): T | null {
  switch (response.status) {
    case 200:
      console.log("Success!");
      return response.data;

    case 201:
      console.log(`Created at ${response.location}`);
      return response.data;

    case 204:
      console.log("No content");
      return null;

    case 400:
      console.error("Validation errors:");
      response.errors.forEach((err) => {
        console.error(`- ${err.field}: ${err.message}`);
      });
      return null;

    case 401:
      console.error("Unauthorized:", response.message);
      return null;

    case 404:
      console.error("Not found:", response.message);
      return null;

    case 500:
      console.error("Server error:", response.message);
      if (response.stack) {
        console.error(response.stack);
      }
      return null;

    default:
      const _exhaustive: never = response;
      return _exhaustive;
  }
}

// Usage
type User = { id: number; name: string };

const successResponse: HttpResponse<User> = {
  status: 200,
  data: { id: 1, name: "John" },
};

const notFoundResponse: HttpResponse<User> = {
  status: 404,
  message: "User not found",
};

handleHttpResponse(successResponse); // Returns user
handleHttpResponse(notFoundResponse); // Returns null

// ============================================
// 8. BENEFITS DEMONSTRATION
// ============================================

// ❌ Without discriminated unions - error prone
type BadState = {
  loading?: boolean;
  data?: string;
  error?: string;
};

function badHandleState(state: BadState) {
  if (state.loading) {
    // What if data also exists?
    return "Loading...";
  }
  if (state.data) {
    // What if error also exists?
    return state.data;
  }
  // Unclear state - multiple properties could be set
}

// ✅ With discriminated unions - clear and safe
type GoodState =
  | { type: "loading" }
  | { type: "success"; data: string }
  | { type: "error"; error: string };

function goodHandleState(state: GoodState) {
  switch (state.type) {
    case "loading":
      return "Loading...";
    case "success":
      return state.data; // Only data exists here
    case "error":
      return state.error; // Only error exists here
  }
}

// ============================================
// KEY TAKEAWAYS
// ============================================

/*
✅ Discriminated unions use a common property to distinguish types
✅ Perfect for state management (loading, success, error)
✅ Enable exhaustive type checking with switch statements
✅ Prevent impossible states (can't be loading AND errored)
✅ Great for Redux/state management actions
✅ TypeScript catches missing cases at compile time
✅ Use "never" type for exhaustiveness checking
✅ More maintainable than boolean flags or optional properties
*/
