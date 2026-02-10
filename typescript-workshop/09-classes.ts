// ============================================
// 09 - CLASSES & OOP
// ============================================

// One example: a repository pattern showing abstract classes,
// access modifiers, implements, and generics with classes.

/**
 * Abstract base repository — defines the contract for data access.
 * Cannot be instantiated directly; must be subclassed.
 * @template T - The entity type stored in this repository.
 */
abstract class BaseRepository<T extends { id: number }> {
  protected items: T[] = [];

  /** Add an item — accessible to subclasses and external code. */
  add(item: T): void {
    this.items.push(item);
  }

  /** Find by id — public method using protected storage. */
  findById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  /** Each subclass must define its own delete logic. */
  abstract delete(id: number): boolean;
}

// --- Concrete implementation ---

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

class UserRepository extends BaseRepository<UserProfile> {
  /** Implements the abstract delete method. */
  delete(id: number): boolean {
    const index = this.items.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  /** Extra method specific to UserRepository. */
  findByEmail(email: string): UserProfile | undefined {
    return this.items.find((u) => u.email === email);
  }

  protected logItems(): void {
    console.log("Current items:", this.items);
    this.helper();
  }

  private helper(): void {
    console.log("This is a private helper method");
  }
}

// --- Usage ---
const repo = new UserRepository();
repo.add({ id: 1, name: "Alice", email: "alice@example.com" });
repo.add({ id: 2, name: "Bob", email: "bob@example.com" });

console.log(repo.findById(1)); // { id: 1, name: "Alice", ... }
console.log(repo.findByEmail("bob@example.com")); // { id: 2, name: "Bob", ... }
console.log(repo.delete(1)); // true
console.log(repo.getAll()); // [{ id: 2, ... }]

/*
  KEY TAKEAWAYS:
  ✅ public (default)  → accessible everywhere
  ✅ protected          → accessible in class + subclasses only
  ✅ private            → accessible in the declaring class only
  ✅ abstract class     → can't be instantiated, defines a contract
  ✅ abstract method    → subclass MUST implement it
  ✅ implements         → a class promises to satisfy an interface
  ✅ Classes work great with generics (<T>)
*/
