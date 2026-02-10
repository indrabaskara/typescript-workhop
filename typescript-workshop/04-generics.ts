// ============================================
// 04 - GENERICS
// ============================================

// --- The Problem: duplicate code ---
function getFirstNumber(arr: number[]): number | undefined {
  return arr[0];
}
function getFirstString(arr: string[]): string | undefined {
  return arr[0];
}

// --- The Solution: generics (<T>) ---
function getFirst<T>(arr: T[]): T | undefined {
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

  get(index: number): T | undefined {
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

// --- Async & Promises (Promise<T> is a generic!) ---
// Promise<T> tells TypeScript what the resolved value will be

type User = { id: number; name: string };

async function fetchUser(id: number): Promise<User> {
  // Simulating an API call — in real code this would be fetch()
  return { id, name: "Alice" };
}

// Generic async function — reuses ApiResponse<T> from above
async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  console.log(`Fetching ${url}...`);
  const fakeData = {} as T; // simulate
  return { data: fakeData, ok: true };
}

// Usage — TS knows the resolved type automatically
async function demo() {
  const user = await fetchUser(1); // type: User
  console.log(user.name); // TS knows .name exists

  const res = await fetchData<string[]>("/api/items");
  if (res.ok) {
    console.log(res.data.length); // TS knows data is string[]
  }
}

demo();

// Typing Promise.all — TS infers a tuple of resolved types
async function loadDashboard() {
  const [userData, allScores] = await Promise.all([
    fetchUser(1), // Promise<User>
    Promise.resolve([95, 87, 100]), // Promise<number[]>
  ]);
  console.log(userData.name, allScores.length); // User, number[]
}

loadDashboard();

/*
  KEY TAKEAWAYS:
  ✅ Generics let you write ONE function/class that works with ANY type
  ✅ TS infers <T> from usage — you rarely need to specify it
  ✅ Use constraints (extends) to require certain properties
  ✅ Promise<T> is a generic — always type your async return values
  ✅ Promise.all preserves individual types in a tuple
  ✅ Common uses: API responses, lists, wrappers, async functions
*/
