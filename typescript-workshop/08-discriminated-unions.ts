// ============================================
// 08 - DISCRIMINATED UNIONS & WRAP-UP
// ============================================

// This is the most useful advanced pattern in TypeScript.
// A "discriminated union" = union types that share a common field
// so TypeScript can tell them apart.

// --- The Problem: ambiguous state ---

// ❌ Bad — can be loading AND have an error at the same time?
type BadState = {
  loading?: boolean;
  data?: string;
  error?: string;
};

// --- The Solution: one state at a time ---

// ✅ Good — each state is its own type with a shared "status" field
type Loading = { status: "loading" };
type Success = { status: "success"; data: string };
type Failed = { status: "error"; error: string };

type RequestState = Loading | Success | Failed;

function render(state: RequestState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return `Data: ${state.data}`; // TS knows .data exists
    case "error":
      return `Error: ${state.error}`; // TS knows .error exists
  }
}

console.log(render({ status: "loading" }));
// → "Loading..."

console.log(render({ status: "success", data: "Hello!" }));
// → "Data: Hello!"

console.log(render({ status: "error", error: "Network failed" }));
// → "Error: Network failed"

// --- Simple real-world example: notifications ---

type EmailNotification = {
  channel: "email";
  to: string;
  subject: string;
};

type SmsNotification = {
  channel: "sms";
  phone: string;
  message: string;
};

type PushNotification = {
  channel: "push";
  title: string;
};

type Notification = EmailNotification | SmsNotification | PushNotification;

function send(n: Notification): string {
  switch (n.channel) {
    case "email":
      return `Email to ${n.to}: ${n.subject}`;
    case "sms":
      return `SMS to ${n.phone}: ${n.message}`;
    case "push":
      return `Push: ${n.title}`;
  }
}

console.log(send({ channel: "email", to: "a@b.com", subject: "Hi" }));
// → "Email to a@b.com: Hi"

console.log(send({ channel: "sms", phone: "+123", message: "Hello" }));
// → "SMS to +123: Hello"

// --- Exhaustiveness check with `never` ---
// If you add a new notification channel later and forget to handle it,
// TypeScript will catch it at compile time:

function sendStrict(n: Notification): string {
  switch (n.channel) {
    case "email":
      return `Email to ${n.to}`;
    case "sms":
      return `SMS to ${n.phone}`;
    case "push":
      return `Push: ${n.title}`;
    default:
      // If all cases are handled, this line is unreachable.
      // If you add a new channel and forget it above, TS will error HERE.
      const _never: never = n;
      return _never;
  }
}

/*
  KEY TAKEAWAYS:
  ✅ Add a shared field (like "status" or "channel") to each type
  ✅ Use switch on that field — TS narrows each case automatically
  ✅ Impossible states become impossible (can't be loading AND errored)
  ✅ Use `never` in default for exhaustiveness checking
  ✅ This pattern is used everywhere: Redux, API responses, UI state, etc.
*/

// ============================================
// WORKSHOP RECAP
// ============================================

/*
  01 - Basics        → types, inference, functions, any vs unknown
  02 - Interface/Type → interface for objects, type for unions
  03 - Unions         → string | number, payment methods
  04 - Generics       → <T> makes code reusable across types
  05 - Utility Types  → Partial, Omit, Pick, Record
  06 - Type Guards    → typeof, instanceof, custom "is" guards
  07 - Literals/Enums → "up" | "down", enum LogLevel, as const
  08 - Discriminated  → shared field + switch = type-safe state

  🎯 Golden rules:
  • Let TS infer when obvious, be explicit with function signatures
  • Prefer unknown over any
  • Use discriminated unions over optional flags
  • Combine utility types (Partial<Omit<T, "id">>) for real patterns
  • Hover over things in your editor — the types will teach you!
*/
