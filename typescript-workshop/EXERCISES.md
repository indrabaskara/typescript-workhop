# TypeScript Workshop - Hands-On Exercises

Complete these exercises during the workshop to practice what you've learned!

---

## Exercise 1: Basic Types & Functions (5 minutes)

Create a function that calculates the total price of items in a shopping cart.

```typescript
// TODO: Define a Product type with id, name, price, and quantity

// TODO: Create a function that takes an array of products and returns the total price

// TODO: Create a function that finds the most expensive product

// Test your code:
const cart = [
  { id: 1, name: "Laptop", price: 999, quantity: 1 },
  { id: 2, name: "Mouse", price: 29, quantity: 2 },
  { id: 3, name: "Keyboard", price: 89, quantity: 1 },
];

// Should return: 1146
// console.log(calculateTotal(cart));

// Should return: { id: 1, name: "Laptop", price: 999, quantity: 1 }
// console.log(findMostExpensive(cart));
```

---

## Exercise 2: Interfaces & Types (5 minutes)

Build a user management system with different user roles.

```typescript
// TODO: Create a base User interface with id, name, email

// TODO: Create Admin type that extends User and adds permissions array

// TODO: Create Guest type that extends User and adds expiresAt date

// TODO: Create a union type for any user type

// TODO: Write a function that greets users differently based on their role
// - Admin: "Welcome back, Admin [name]!"
// - Guest: "Hello, Guest [name]. Access expires at [date]"
// - User: "Hi, [name]!"

// Test your code:
const admin = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  permissions: ["read", "write", "delete"],
};

const guest = {
  id: 2,
  name: "Bob",
  email: "bob@example.com",
  expiresAt: new Date("2024-12-31"),
};
```

---

## Exercise 3: Generics (5 minutes)

Create a generic cache system.

```typescript
// TODO: Create a generic Cache class that:
// - Stores key-value pairs
// - Has get(key) method
// - Has set(key, value) method
// - Has has(key) method that returns boolean
// - Has delete(key) method

// TODO: Add a method that returns all values as an array

// Test your code:
const userCache = new Cache<string, { id: number; name: string }>();
userCache.set("user1", { id: 1, name: "John" });
userCache.set("user2", { id: 2, name: "Jane" });

// console.log(userCache.get("user1")); // { id: 1, name: "John" }
// console.log(userCache.has("user3")); // false

const numberCache = new Cache<string, number>();
numberCache.set("count", 42);
// console.log(numberCache.get("count")); // 42
```

---

## Exercise 4: Utility Types (5 minutes)

Transform types for different use cases.

```typescript
interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// TODO: Create CreatePostDTO type - omit id, createdAt, updatedAt

// TODO: Create UpdatePostDTO type - make all fields except id optional, omit createdAt, updatedAt, authorId

// TODO: Create PostSummary type - pick only id, title, createdAt

// TODO: Create a function that creates a post (takes CreatePostDTO, returns BlogPost)

// TODO: Create a function that updates a post (takes id and UpdatePostDTO, returns BlogPost)
```

---

## Exercise 5: Discriminated Unions (5 minutes)

Build a type-safe notification system.

```typescript
// TODO: Create notification types:
// - EmailNotification: type "email", to, subject, body
// - SMSNotification: type "sms", phoneNumber, message
// - PushNotification: type "push", deviceId, title, body

// TODO: Create a union type for all notifications

// TODO: Write a send function that handles each notification type differently
// Use a switch statement on the type property

// Test your code:
const email = {
  type: "email",
  to: "user@example.com",
  subject: "Welcome",
  body: "Welcome to our service!",
};

const sms = {
  type: "sms",
  phoneNumber: "+1234567890",
  message: "Your code is 123456",
};

// send(email); // Should log: "Sending email to user@example.com"
// send(sms);   // Should log: "Sending SMS to +1234567890"
```

---

## Exercise 6: Real-World Challenge (10 minutes)

Build a type-safe API client for a todo application.

```typescript
// TODO: Define types
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

// TODO: Create ApiResponse type (discriminated union):
// - Success: status "success", data
// - Error: status "error", message

// TODO: Create TodoService class with methods:
// - getTodos(): Promise<ApiResponse<Todo[]>>
// - getTodoById(id: number): Promise<ApiResponse<Todo>>
// - createTodo(data: Omit<Todo, "id">): Promise<ApiResponse<Todo>>
// - updateTodo(id: number, data: Partial<Omit<Todo, "id">>): Promise<ApiResponse<Todo>>
// - deleteTodo(id: number): Promise<ApiResponse<void>>

// TODO: Implement each method (you can simulate with mock data)

// Test your implementation:
const todoService = new TodoService();

async function testTodoService() {
  const todos = await todoService.getTodos();
  if (todos.status === "success") {
    console.log("Todos:", todos.data);
  }

  const newTodo = await todoService.createTodo({
    title: "Learn TypeScript",
    completed: false,
    userId: 1,
  });

  if (newTodo.status === "success") {
    console.log("Created:", newTodo.data);
  }
}
```

---

## Bonus Exercise: Advanced Patterns (Optional)

Create a query builder with type safety.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
}

// TODO: Create a QueryBuilder class that:
// - Takes a generic type T
// - Has where(predicate) method that filters
// - Has sortBy(field, direction) method
// - Has limit(count) method
// - Has execute(data) method that returns filtered/sorted/limited results
// - All methods (except execute) return 'this' for chaining

// Make it type-safe so:
// - sortBy only accepts valid field names
// - direction is "asc" | "desc"

// Example usage:
const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", age: 25, active: true },
  { id: 2, name: "Bob", email: "bob@example.com", age: 30, active: false },
  { id: 3, name: "Charlie", email: "charlie@example.com", age: 35, active: true },
];

const result = new QueryBuilder<User>()
  .where(user => user.active)
  .where(user => user.age > 25)
  .sortBy("name", "asc")
  .limit(10)
  .execute(users);

// console.log(result); // [{ id: 3, name: "Charlie", ... }]
```

---

## Solutions

Solutions will be discussed after each exercise. Try to complete them on your own first!

### Tips for Success:
1. Start simple - get basic functionality working first
2. Use TypeScript's error messages to guide you
3. Leverage autocomplete (Ctrl/Cmd + Space)
4. Hover over variables to see their inferred types
5. Don't be afraid to ask questions!

### Common Mistakes to Avoid:
- Using `any` instead of proper types
- Forgetting to handle all cases in discriminated unions
- Not using type guards when working with unions
- Over-complicating types - keep them simple and readable

---

Good luck! 🚀