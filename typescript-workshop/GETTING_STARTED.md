# Getting Started with TypeScript Workshop

## 🚀 Quick Start (5 minutes)

This guide will get you up and running with the TypeScript workshop in just 5 minutes!

---

## Step 1: Check Prerequisites

### Required
```bash
# Check Node.js (need v14 or higher)
node --version

# Check npm
npm --version
```

If you don't have Node.js installed:
- Download from [nodejs.org](https://nodejs.org/)
- Install the LTS version

---

## Step 2: Install TypeScript

### Global Installation (Recommended)
```bash
npm install -g typescript ts-node
```

### Verify Installation
```bash
# Should show version 5.x or higher
tsc --version

# Should show ts-node version
ts-node --version
```

---

## Step 3: Set Up Workshop Files

### Option A: Already Have the Files
If you're in the workshop directory:
```bash
# Install dependencies
npm install

# You're ready to go!
```

### Option B: Starting Fresh
```bash
# Create project directory
mkdir typescript-workshop
cd typescript-workshop

# Initialize npm
npm init -y

# Install dependencies
npm install --save-dev typescript @types/node ts-node

# Initialize TypeScript
npx tsc --init
```

---

## Step 4: Run Your First TypeScript File

### Test the Setup
Create a test file:
```bash
echo 'const greeting: string = "Hello TypeScript!"; console.log(greeting);' > test.ts
```

Run it:
```bash
# Using ts-node (direct execution)
ts-node test.ts

# OR compile then run
tsc test.ts
node test.js
```

You should see: `Hello TypeScript!`

✅ **Success!** You're ready for the workshop!

---

## Step 5: Workshop Navigation

### For Presenters/Instructors

**Before the Workshop:**
1. Review `PRESENTATION.md` for slides and talking points
2. Test all example files to ensure they run
3. Prepare the `EXERCISES.md` for hands-on practice
4. Have `CHEATSHEET.md` ready for reference

**During the Workshop:**
1. Follow `PRESENTATION.md` structure
2. Live-code using the example files
3. Give participants time for exercises
4. Use TypeScript Playground for quick demos: https://www.typescriptlang.org/play

### For Participants/Self-Learners

**Recommended Path:**
```
1. Read PRESENTATION.md (overview)
   ↓
2. Follow along with 01-basics.ts
   ↓
3. Work through EXERCISES.md (Exercise 1)
   ↓
4. Continue through files 02-10 in order
   ↓
5. Complete remaining exercises
   ↓
6. Keep CHEATSHEET.md for reference
```

**Quick Commands:**
```bash
# Run any example file
npm run run:basics       # 01-basics.ts
npm run run:generics     # 04-generics.ts
# ... etc (see package.json for all)

# Or use ts-node directly
ts-node 01-basics.ts

# Check for type errors without running
npm run check

# Watch mode (auto-compile on save)
npm run compile:watch
```

---

## Step 6: Configure Your Editor (VS Code Recommended)

### Install VS Code Extensions
1. Open VS Code
2. Install these extensions:
   - **ESLint** (for linting)
   - **Prettier** (for formatting)
   - **Error Lens** (inline error display)

### Enable TypeScript Features
VS Code has built-in TypeScript support! Just open a `.ts` file.

**Pro Tips:**
- Hover over variables to see types
- `Cmd/Ctrl + Click` to go to definition
- `F2` to rename symbol everywhere
- `Cmd/Ctrl + .` for quick fixes
- `Cmd/Ctrl + Space` for autocomplete

---

## Troubleshooting

### "tsc: command not found"
```bash
# Install TypeScript globally
npm install -g typescript

# Or use npx
npx tsc --version
```

### "Cannot find module '@types/node'"
```bash
npm install --save-dev @types/node
```

### "Property does not exist on type"
This is TypeScript working correctly! It's catching a potential error.
- Read the error message carefully
- Check your types
- Use type guards if needed

### Files won't run with ts-node
```bash
# Make sure ts-node is installed
npm install -g ts-node

# Or use it with npx
npx ts-node filename.ts
```

### Compilation errors in example files
Some files demonstrate concepts and may not run standalone. They're meant to show syntax and patterns. Look for the `// Usage` sections for runnable code.

---

## Workshop Structure

### Files Overview

```
📁 typescript-workshop/
│
├── 📄 README.md              ← Start here (overview)
├── 📄 GETTING_STARTED.md     ← You are here!
├── 📄 PRESENTATION.md        ← Workshop slides
├── 📄 CHEATSHEET.md          ← Quick reference
├── 📄 EXERCISES.md           ← Hands-on practice
│
├── ⚙️  tsconfig.json          ← TypeScript config
├── 📦 package.json           ← Dependencies & scripts
│
└── 💻 Workshop Files:
    ├── 01-basics.ts                    (15 min)
    ├── 02-interfaces-types.ts          (15 min)
    ├── 03-unions-intersections.ts      (20 min)
    ├── 04-generics.ts                  (20 min)
    ├── 05-utility-types.ts             (20 min)
    ├── 06-type-guards.ts               (15 min)
    ├── 07-literals-enums.ts            (15 min)
    ├── 08-discriminated-unions.ts      (15 min)
    ├── 09-conditional-types.ts         (15 min)
    └── 10-advanced-patterns.ts         (20 min)
```

### Time Estimates
- **Full workshop:** 50 minutes (presentation)
- **With exercises:** 90 minutes (recommended)
- **Self-paced:** 2-3 hours (thorough learning)

---

## Learning Modes

### 🎤 Workshop Mode (50 min)
**For instructors presenting to a group:**
1. Use `PRESENTATION.md` as your guide
2. Live-code key examples
3. Show 3-4 exercises, solve together
4. Leave time for Q&A

### 🧑‍💻 Hands-On Mode (90 min)
**For interactive learning:**
1. Brief overview (10 min)
2. Participants work through exercises (60 min)
3. Review solutions together (20 min)

### 📚 Self-Study Mode (flexible)
**For individual learning:**
1. Read each file thoroughly
2. Experiment with code
3. Complete all exercises
4. Take breaks between sections
5. Use TypeScript Playground to test ideas

---

## Tips for Success

### For Presenters
✅ **Do:**
- Start with "why TypeScript?" (motivation)
- Use real-world examples from your codebase
- Encourage questions throughout
- Live-code when possible
- Share the cheatsheet early

❌ **Don't:**
- Rush through basics
- Skip the "why" behind patterns
- Use overly complex examples
- Ignore questions to save time

### For Learners
✅ **Do:**
- Type the code yourself (don't just read)
- Experiment and break things
- Use the TypeScript Playground
- Hover over types to understand them
- Complete the exercises

❌ **Don't:**
- Try to memorize everything
- Skip the exercises
- Get discouraged by errors (they're learning!)
- Rush through advanced topics

---

## Next Steps After Setup

### You're All Set! Choose Your Path:

**Path 1: Quick Overview (30 min)**
→ `PRESENTATION.md` + `CHEATSHEET.md`

**Path 2: Learn by Doing (90 min)**
→ `EXERCISES.md` + refer to examples as needed

**Path 3: Deep Dive (3 hours)**
→ Read all files 01-10 in order + complete all exercises

**Path 4: Just-in-Time Learning (ongoing)**
→ Keep `CHEATSHEET.md` open while coding

---

## Useful Commands Reference

```bash
# Run a TypeScript file
ts-node filename.ts

# Compile TypeScript to JavaScript
tsc filename.ts

# Compile all files (uses tsconfig.json)
tsc

# Watch mode (auto-recompile)
tsc --watch

# Check for errors without compiling
tsc --noEmit

# Use TypeScript REPL
ts-node

# Format code with Prettier
npx prettier --write "**/*.ts"

# Get help
tsc --help
ts-node --help
```

---

## Resources

### Official Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### Practice & Challenges
- [Type Challenges](https://github.com/type-challenges/type-challenges)
- [Exercism TypeScript Track](https://exercism.org/tracks/typescript)

### Community
- [TypeScript Discord](https://discord.gg/typescript)
- [r/typescript](https://www.reddit.com/r/typescript/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/typescript)

---

## Support

### Getting Help During Workshop
1. Check the error message (they're usually helpful!)
2. Look at the relevant example file
3. Refer to `CHEATSHEET.md`
4. Ask the instructor or a peer
5. Try the TypeScript Playground

### After Workshop
1. Search TypeScript docs
2. Use Stack Overflow
3. Join TypeScript Discord
4. Review workshop files

---

## Frequently Asked Questions

**Q: Do I need to know JavaScript well?**
A: Basic JavaScript knowledge is sufficient. TypeScript adds types to JavaScript.

**Q: How long does it take to learn TypeScript?**
A: Basics: 1 day. Comfortable: 1 week. Proficient: 1 month of practice.

**Q: Can I use TypeScript in my existing JavaScript project?**
A: Yes! Start by renaming `.js` files to `.ts` and gradually add types.

**Q: Is TypeScript hard?**
A: No! If you know JavaScript, you already know most of TypeScript. Types are the new part.

**Q: What if I get stuck?**
A: That's normal! Check the examples, use the playground, and don't hesitate to ask.

---

## Ready to Start? 🎉

You're all set up! Here's what to do now:

1. ✅ TypeScript is installed
2. ✅ Dependencies are ready
3. ✅ You know how to run files
4. ✅ You have the resources

**Next Step:** Open `README.md` or `PRESENTATION.md` and start learning!

---

**Good luck with the workshop!** 🚀

Remember: TypeScript is a tool to help you write better code. Embrace the compiler errors—they're preventing bugs!