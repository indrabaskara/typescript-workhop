// ============================================
// 08 - DISCRIMINATED UNIONS & WRAP-UP
// ============================================

// One example: a request-state machine showing discriminated unions,
// switch narrowing, and exhaustiveness checking with never.

type Loading = { status: "loading" };
type Success = { status: "success"; data: string };
type Failed = { status: "error"; error: string };

type RequestState = Loading | Success | Failed;

/**
 * Renders a UI string based on the current request state.
 * Uses a discriminated union (shared "status" field) with switch
 * for type-safe narrowing and a never-based exhaustiveness check.
 * @param state - The current request state.
 * @returns A display string for the given state.
 */
function render(state: RequestState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return `Data: ${state.data}`; // TS knows .data exists
    case "error":
      return `Error: ${state.error}`; // TS knows .error exists
    default:
      // Exhaustiveness check — TS errors here if a case is missing
      const _never: never = state;
      return _never;
  }
}

console.log(render({ status: "loading" }));
// → "Loading..."

console.log(render({ status: "success", data: "Hello!" }));
// → "Data: Hello!"

console.log(render({ status: "error", error: "Network failed" }));
// → "Error: Network failed"

/*
  KEY TAKEAWAYS:
  ✅ Add a shared field (like "status") to each type
  ✅ Use switch on that field — TS narrows each case automatically
  ✅ Impossible states become impossible (can't be loading AND errored)
  ✅ Use `never` in default for exhaustiveness checking
*/

// ============================================
// WORKSHOP RECAP
// ============================================

/*
  01 - Basics        → types, inference, functions, any vs unknown
  02 - Interface/Type → interface for objects, type for unions
  03 - Unions         → string | number, payment methods
  04 - Generics       → <T>, Promise<T>, async return types
  05 - Utility Types  → Partial, Omit, Pick, Record
  06 - Type Guards    → typeof, instanceof, catch(unknown), error handling
  07 - Literals/Enums → "up" | "down", enum LogLevel, as const
  08 - Discriminated  → shared field + switch = type-safe state
*/
