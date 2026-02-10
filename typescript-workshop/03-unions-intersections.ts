// ============================================
// 03 - UNIONS & INTERSECTIONS
// ============================================

// One example: a payment system showing unions (|) for alternate
// types and intersections (&) for combining types.

type CreditCard = { method: "card"; cardNumber: string };
type BankTransfer = { method: "bank"; accountNumber: string };
type Cash = { method: "cash" };

// Union (|) = value can be ONE of several types
type PaymentMethod = CreditCard | BankTransfer | Cash;

// Intersection (&) = value must satisfy ALL types
type PaymentRecord = { amount: number; currency: string } & {
  paymentMethod: PaymentMethod;
};

/**
 * Describes a payment method using type narrowing via switch.
 * @param pm - The payment method to describe.
 * @returns A human-readable description of the payment.
 */
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
*/
