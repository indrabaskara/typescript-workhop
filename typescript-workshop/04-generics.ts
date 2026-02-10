// ============================================
// 04 - GENERICS
// ============================================

// --- The Problem: duplicate code ---
function getFirstNumber(arr: number[]): number {
  return arr[0];
}
function getFirstString(arr: string[]): string {
  return arr[0];
}

// --- The Solution: generics (<T>) ---
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const n = getFirst([10, 20, 30]); // T = number
const s = getFirst(["hi", "bye"]); // T = string

// you can also be explicit
const x = getFirst<boolean>([true, false]);

// --- Generic with multiple params ---
function makePair<K, V>(key: K, value: V) {
  return { key, value };
}

const pair = makePair("age", 30); // { key: string, value: number }

// --- Generic interface ---
interface ApiResponse<T> {
  data: T;
  ok: boolean;
}

const userRes: ApiResponse<{ name: string }> = {
  data: { name: "Alice" },
  ok: true,
};

const numRes: ApiResponse<number[]> = {
  data: [1, 2, 3],
  ok: true,
};

// --- Generic constraint (extends) ---
// "T must have a .length property"
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length);
}

logLength("hello"); // ✅ string has .length
logLength([1, 2]); // ✅ array has .length
// logLength(123);  // ❌ number has no .length

// --- Simple real-world example: a typed list ---
class TypedList<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T {
    return this.items[index];
  }

  getAll(): T[] {
    return [...this.items];
  }
}

const todos = new TypedList<string>();
todos.add("Buy groceries");
todos.add("Walk the dog");
console.log(todos.getAll()); // ["Buy groceries", "Walk the dog"]

const scores = new TypedList<number>();
scores.add(95);
scores.add(87);
console.log(scores.get(0)); // 95

// --- Default generic type ---
interface Container<T = string> {
  value: T;
}

const c1: Container = { value: "hello" }; // defaults to string
const c2: Container<number> = { value: 42 };

/*
  KEY TAKEAWAYS:
  ✅ Generics let you write ONE function/class that works with ANY type
  ✅ TS infers <T> from usage — you rarely need to specify it
  ✅ Use constraints (extends) to require certain properties
  ✅ Common uses: API responses, lists, wrappers, utility functions
*/
