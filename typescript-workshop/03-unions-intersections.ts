// ============================================
// 03 - UNIONS & INTERSECTIONS
// ============================================

// --- Union (|) = "this OR that" ---
type Status = "pending" | "paid" | "failed";
type ID = string | number;

let orderId: ID = "abc-123";
orderId = 42; // also valid

function printStatus(status: Status) {
  console.log(`Order is ${status}`);
}

printStatus("paid"); // ✅
// printStatus("cancelled"); // ❌ not in the union

// --- Working with unions (narrowing) ---
function formatId(id: string | number): string {
  if (typeof id === "string") {
    return id.toUpperCase(); // TS knows it's string
  }
  return `#${id}`; // TS knows it's number
}

// --- Intersection (&) = "this AND that" ---
type HasName = { name: string };
type HasEmail = { email: string };

type Contact = HasName & HasEmail; // must have BOTH

const contact: Contact = {
  name: "Alice",
  email: "alice@example.com",
};

// --- Simple Real-World Example: Payments ---

type CreditCard = {
  method: "card";
  cardNumber: string;
};

type BankTransfer = {
  method: "bank";
  accountNumber: string;
};

type Cash = {
  method: "cash";
};

// Union of payment methods
type PaymentMethod = CreditCard | BankTransfer | Cash;

type Payment = {
  amount: number;
  currency: string;
} & { method: PaymentMethod }; // intersection adds method

function describePayment(pm: PaymentMethod): string {
  switch (pm.method) {
    case "card":
      return `Card ending in ${pm.cardNumber.slice(-4)}`;
    case "bank":
      return `Bank account ${pm.accountNumber}`;
    case "cash":
      return "Cash payment";
  }
}

console.log(
  describePayment({ method: "card", cardNumber: "4111111111111234" }),
);
// → "Card ending in 1234"

console.log(describePayment({ method: "cash" }));
// → "Cash payment"

/*
  KEY TAKEAWAYS:
  ✅ Union (|) = value can be ONE of several types
  ✅ Intersection (&) = value must satisfy ALL types
  ✅ Use switch/if to narrow unions safely
  ✅ Unions + a shared field ("method") = discriminated union (topic 07)
*/
