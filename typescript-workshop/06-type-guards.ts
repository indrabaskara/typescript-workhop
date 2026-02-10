// ============================================
// 06 - TYPE GUARDS & NARROWING
// ============================================

// One example: an error-handling pipeline showing typeof, instanceof,
// custom type guard (is), and catch(unknown) narrowing.

/**
 * Custom error class for validation failures.
 * Demonstrates instanceof narrowing with custom Error subclasses.
 */
class ValidationError extends Error {
  constructor(
    public field: string,
    message: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Safely extracts an error message from an unknown value.
 * Uses typeof and instanceof guards to narrow the type.
 * @param err - The caught error (unknown type).
 * @returns A human-readable error message string.
 */
function getErrorMessage(err: unknown): string {
  if (err instanceof ValidationError) {
    return `Validation [${err.field}]: ${err.message}`; // narrowed to ValidationError
  }
  if (err instanceof Error) {
    return err.message; // narrowed to Error
  }
  if (typeof err === "string") {
    return err; // narrowed to string
  }
  return "An unknown error occurred";
}

// --- Usage with catch(unknown) ---
function riskyOperation(): string {
  try {
    throw new ValidationError("email", "Invalid format");
  } catch (err: unknown) {
    return `Failed: ${getErrorMessage(err)}`;
  }
}

console.log(riskyOperation());
// → 'Failed: Validation [email]: Invalid format'

/*
  KEY TAKEAWAYS:
  ✅ typeof     → for primitives (string, number, boolean)
  ✅ instanceof → for class instances (including custom Errors)
  ✅ "in"       → check if property exists on object
  ✅ Custom guard (x is Type) → for your own logic
  ✅ catch (err: unknown) → always narrow before accessing properties
*/
