// ============================================
// 04 - GENERICS
// ============================================

// One example: a generic API response wrapper with constraint,
// async usage, and Promise<T>.

/**
 * Generic API response — works with any data type.
 * @template T - The type of the response data.
 */
interface ApiResponse<T> {
  data: T;
  ok: boolean;
}

type Profile = { id: number; name: string };

/**
 * Fetches data from a URL and returns a typed ApiResponse.
 * Demonstrates generic constraint and async/Promise<T>.
 * @template T - Must have a defined shape (extends object).
 * @param url - The endpoint to fetch from.
 * @returns A promise resolving to an ApiResponse of type T.
 */
async function fetchData<T extends object>(
  url: string,
): Promise<ApiResponse<T>> {
  console.log(`Fetching ${url}...`);
  const fakeData = {} as T; // simulate
  return { data: fakeData, ok: true };
}

// --- Usage ---
async function demo() {
  const res = await fetchData<Profile>("/api/profile/1");
  if (res.ok) {
    console.log(res.data.name); // TS knows data is Profile
  }
}

demo();

/*
  KEY TAKEAWAYS:
  ✅ Generics let you write ONE function/class that works with ANY type
  ✅ TS infers <T> from usage — you rarely need to specify it
  ✅ Use constraints (extends) to require certain properties
  ✅ Promise<T> is a generic — always type your async return values
*/
