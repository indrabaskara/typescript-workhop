# Modern TypeScript Workshop (50 min)

A hands-on workshop from basics to practical patterns. Short examples, no fluff.

## Setup

```bash
npm install -g typescript ts-node
tsc --version  # should be 5.x
```

## Files

| # | File | Topic | Time |
|---|------|-------|------|
| 01 | `01-basics.ts` | Types, inference, functions, any vs unknown | 7 min |
| 02 | `02-interfaces-types.ts` | Interface vs Type — when to use which | 5 min |
| 03 | `03-unions-intersections.ts` | Union (`\|`) and Intersection (`&`) | 5 min |
| 04 | `04-generics.ts` | `<T>` — write once, use with any type | 7 min |
| 05 | `05-utility-types.ts` | Partial, Omit, Pick, Record | 7 min |
| 06 | `06-type-guards.ts` | typeof, instanceof, custom guards | 5 min |
| 07 | `07-literals-enums.ts` | Literal types, enums, `as const` | 5 min |
| 08 | `08-discriminated-unions.ts` | The most useful advanced pattern + recap | 7 min |

## How to Run

```bash
# Run any file directly
ts-node 01-basics.ts

# Or compile first
tsc 01-basics.ts && node 01-basics.js

# Check for type errors without running
tsc --noEmit
```

## Golden Rules

✅ **Do:**
- Let TS infer variable types when obvious
- Be explicit with function params and return types
- Use `interface` for objects, `type` for unions
- Use discriminated unions instead of optional boolean flags
- Hover over things in VS Code — the types teach you

❌ **Don't:**
- Use `any` (use `unknown` if you must)
- Ignore red squiggles — they're catching real bugs
- Over-annotate — `let x = 5` is fine, no need for `let x: number = 5`

## Quick Reference

See `CHEATSHEET.md` for a one-page summary of all syntax.

## Resources

- [TypeScript Playground](https://www.typescriptlang.org/play) — try code in the browser
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Type Challenges](https://github.com/type-challenges/type-challenges) — practice problems