/**
 * 10 - ADVANCED PATTERNS
 * Real-world TypeScript patterns for complex applications
 */

// ============================================
// 1. BUILDER PATTERN WITH FLUENT API
// ============================================

class QueryBuilder<T> {
  private filters: Array<(item: T) => boolean> = [];
  private sortFn?: (a: T, b: T) => number;
  private limitCount?: number;

  where(predicate: (item: T) => boolean): this {
    this.filters.push(predicate);
    return this;
  }

  sortBy(fn: (a: T, b: T) => number): this {
    this.sortFn = fn;
    return this;
  }

  limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  execute(data: T[]): T[] {
    let result = [...data];

    // Apply filters
    for (const filter of this.filters) {
      result = result.filter(filter);
    }

    // Apply sorting
    if (this.sortFn) {
      result.sort(this.sortFn);
    }

    // Apply limit
    if (this.limitCount !== undefined) {
      result = result.slice(0, this.limitCount);
    }

    return result;
  }
}

// Usage
type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

const products: Product[] = [
  { id: 1, name: "Laptop", price: 999, category: "electronics" },
  { id: 2, name: "Mouse", price: 29, category: "electronics" },
  { id: 3, name: "Desk", price: 299, category: "furniture" },
];

const expensiveElectronics = new QueryBuilder<Product>()
  .where((p) => p.category === "electronics")
  .where((p) => p.price > 50)
  .sortBy((a, b) => b.price - a.price)
  .limit(10)
  .execute(products);

// ============================================
// 2. DEPENDENCY INJECTION PATTERN
// ============================================

// Define interfaces for dependencies
interface Logger {
  log(message: string): void;
  error(message: string): void;
}

interface Database {
  query<T>(sql: string): Promise<T[]>;
}

interface Cache {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttl?: number): void;
}

// Implementations
class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

class MemoryCache implements Cache {
  private store = new Map<string, any>();

  get<T>(key: string): T | null {
    return this.store.get(key) ?? null;
  }

  set<T>(key: string, value: T, ttl?: number): void {
    this.store.set(key, value);
    if (ttl) {
      setTimeout(() => this.store.delete(key), ttl);
    }
  }
}

// Service with dependency injection
class UserService {
  constructor(
    private logger: Logger,
    private cache: Cache
  ) {}

  async getUser(id: number): Promise<{ id: number; name: string } | null> {
    // Check cache first
    const cached = this.cache.get<{ id: number; name: string }>(`user:${id}`);
    if (cached) {
      this.logger.log(`Cache hit for user ${id}`);
      return cached;
    }

    this.logger.log(`Fetching user ${id} from database`);
    // Simulated database call
    const user = { id, name: `User ${id}` };

    // Cache the result
    this.cache.set(`user:${id}`, user, 60000);

    return user;
  }
}

// Usage
const logger = new ConsoleLogger();
const cache = new MemoryCache();
const userService = new UserService(logger, cache);

// ============================================
// 3. REPOSITORY PATTERN
// ============================================

interface Repository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, "id">): Promise<T>;
  update(id: ID, entity: Partial<T>): Promise<T>;
  delete(id: ID): Promise<boolean>;
}

type Entity = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

type User = Entity & {
  name: string;
  email: string;
};

class UserRepository implements Repository<User, string> {
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async create(data: Omit<User, "id">): Promise<User> {
    const user: User = {
      id: Math.random().toString(36),
      ...data,
    };
    this.users.push(user);
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");

    this.users[index] = {
      ...this.users[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.users[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }

  // Custom query methods
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) ?? null;
  }
}

// ============================================
// 4. STATE MACHINE PATTERN
// ============================================

type OrderState = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

type OrderEvent =
  | { type: "CONFIRM" }
  | { type: "SHIP"; trackingNumber: string }
  | { type: "DELIVER" }
  | { type: "CANCEL"; reason: string };

type Order = {
  id: string;
  state: OrderState;
  trackingNumber?: string;
  cancellationReason?: string;
};

class OrderStateMachine {
  private validTransitions: Record<OrderState, OrderState[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  canTransition(from: OrderState, to: OrderState): boolean {
    return this.validTransitions[from].includes(to);
  }

  transition(order: Order, event: OrderEvent): Order {
    switch (event.type) {
      case "CONFIRM":
        if (!this.canTransition(order.state, "confirmed")) {
          throw new Error(`Cannot confirm order in ${order.state} state`);
        }
        return { ...order, state: "confirmed" };

      case "SHIP":
        if (!this.canTransition(order.state, "shipped")) {
          throw new Error(`Cannot ship order in ${order.state} state`);
        }
        return {
          ...order,
          state: "shipped",
          trackingNumber: event.trackingNumber,
        };

      case "DELIVER":
        if (!this.canTransition(order.state, "delivered")) {
          throw new Error(`Cannot deliver order in ${order.state} state`);
        }
        return { ...order, state: "delivered" };

      case "CANCEL":
        if (!this.canTransition(order.state, "cancelled")) {
          throw new Error(`Cannot cancel order in ${order.state} state`);
        }
        return {
          ...order,
          state: "cancelled",
          cancellationReason: event.reason,
        };

      default:
        const _exhaustive: never = event;
        throw new Error(`Unknown event: ${_exhaustive}`);
    }
  }
}

// Usage
const stateMachine = new OrderStateMachine();
let order: Order = { id: "order_123", state: "pending" };

order = stateMachine.transition(order, { type: "CONFIRM" });
order = stateMachine.transition(order, { type: "SHIP", trackingNumber: "TRACK123" });
order = stateMachine.transition(order, { type: "DELIVER" });

// ============================================
// 5. OBSERVABLE PATTERN (EVENT EMITTER)
// ============================================

type EventHandler<T = any> = (data: T) => void;

class EventEmitter<EventMap extends Record<string, any>> {
  private listeners = new Map<keyof EventMap, Set<EventHandler>>();

  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  off<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  once<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    const onceHandler: EventHandler<EventMap[K]> = (data) => {
      handler(data);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }
}

// Define event types
type UserEvents = {
  login: { userId: string; timestamp: Date };
  logout: { userId: string };
  profileUpdate: { userId: string; fields: string[] };
};

const userEvents = new EventEmitter<UserEvents>();

userEvents.on("login", (data) => {
  console.log(`User ${data.userId} logged in at ${data.timestamp}`);
});

userEvents.on("profileUpdate", (data) => {
  console.log(`User ${data.userId} updated: ${data.fields.join(", ")}`);
});

userEvents.emit("login", { userId: "user_123", timestamp: new Date() });

// ============================================
// 6. STRATEGY PATTERN
// ============================================

interface PaymentStrategy {
  pay(amount: number): Promise<{ success: boolean; transactionId?: string }>;
}

class CreditCardPayment implements PaymentStrategy {
  constructor(private cardNumber: string) {}

  async pay(amount: number) {
    console.log(`Charging $${amount} to card ${this.cardNumber}`);
    return { success: true, transactionId: `cc_${Date.now()}` };
  }
}

class PayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}

  async pay(amount: number) {
    console.log(`Charging $${amount} to PayPal account ${this.email}`);
    return { success: true, transactionId: `pp_${Date.now()}` };
  }
}

class CryptoPayment implements PaymentStrategy {
  constructor(private walletAddress: string) {}

  async pay(amount: number) {
    console.log(`Sending $${amount} worth of crypto to ${this.walletAddress}`);
    return { success: true, transactionId: `crypto_${Date.now()}` };
  }
}

class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  async processPayment(amount: number) {
    return await this.strategy.pay(amount);
  }
}

// Usage
const processor = new PaymentProcessor(
  new CreditCardPayment("4111-1111-1111-1111")
);
await processor.processPayment(99.99);

// Switch strategy
processor.setStrategy(new PayPalPayment("user@example.com"));
await processor.processPayment(49.99);

// ============================================
// 7. DECORATOR PATTERN (FUNCTIONAL)
// ============================================

type AsyncFunction<T extends any[], R> = (...args: T) => Promise<R>;

// Retry decorator
function withRetry<T extends any[], R>(
  fn: AsyncFunction<T, R>,
  maxRetries: number = 3
): AsyncFunction<T, R> {
  return async (...args: T): Promise<R> => {
    let lastError: any;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        console.log(`Retry ${i + 1}/${maxRetries}`);
      }
    }

    throw lastError;
  };
}

// Cache decorator
function withCache<T extends any[], R>(
  fn: AsyncFunction<T, R>,
  ttl: number = 60000
): AsyncFunction<T, R> {
  const cache = new Map<string, { value: R; expiry: number }>();

  return async (...args: T): Promise<R> => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && cached.expiry > Date.now()) {
      console.log("Cache hit");
      return cached.value;
    }

    const result = await fn(...args);
    cache.set(key, { value: result, expiry: Date.now() + ttl });
    return result;
  };
}

// Timing decorator
function withTiming<T extends any[], R>(
  fn: AsyncFunction<T, R>
): AsyncFunction<T, R> {
  return async (...args: T): Promise<R> => {
    const start = Date.now();
    const result = await fn(...args);
    const end = Date.now();
    console.log(`Function took ${end - start}ms`);
    return result;
  };
}

// Compose decorators
async function fetchUser(id: number): Promise<{ id: number; name: string }> {
  // Simulated API call
  return { id, name: `User ${id}` };
}

const enhancedFetchUser = withTiming(withCache(withRetry(fetchUser, 3)));

// ============================================
// 8. FACTORY PATTERN WITH REGISTRY
// ============================================

interface Notification {
  send(to: string, message: string): Promise<void>;
}

class EmailNotification implements Notification {
  async send(to: string, message: string): Promise<void> {
    console.log(`Email to ${to}: ${message}`);
  }
}

class SmsNotification implements Notification {
  async send(to: string, message: string): Promise<void> {
    console.log(`SMS to ${to}: ${message}`);
  }
}

class PushNotification implements Notification {
  async send(to: string, message: string): Promise<void> {
    console.log(`Push notification to ${to}: ${message}`);
  }
}

type NotificationType = "email" | "sms" | "push";

class NotificationFactory {
  private registry = new Map<NotificationType, () => Notification>();

  register(type: NotificationType, creator: () => Notification): void {
    this.registry.set(type, creator);
  }

  create(type: NotificationType): Notification {
    const creator = this.registry.get(type);
    if (!creator) {
      throw new Error(`Unknown notification type: ${type}`);
    }
    return creator();
  }
}

// Setup factory
const notificationFactory = new NotificationFactory();
notificationFactory.register("email", () => new EmailNotification());
notificationFactory.register("sms", () => new SmsNotification());
notificationFactory.register("push", () => new PushNotification());

// Usage
const emailNotif = notificationFactory.create("email");
await emailNotif.send("user@example.com", "Hello!");

// ============================================
// KEY TAKEAWAYS
// ============================================

/*
✅ Builder Pattern - Fluent API for constructing complex objects
✅ Dependency Injection - Loosely coupled, testable code
✅ Repository Pattern - Abstract data access layer
✅ State Machine - Manage complex state transitions safely
✅ Observable Pattern - Event-driven architecture
✅ Strategy Pattern - Runtime algorithm selection
✅ Decorator Pattern - Enhance functions without modifying them
✅ Factory Pattern - Centralize object creation logic
✅ TypeScript enforces these patterns at compile time
✅ Patterns improve maintainability and scalability
*/
