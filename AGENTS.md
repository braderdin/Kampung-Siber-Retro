# Core Rules for Qwen3 Coder Dedicated Engine

## 🏗️ Code Generation & Architecture Rules
- **FULL FILE OUTPUT:** When building, modifying, fixing, or refactoring code, always output the **FULL and complete** file structure.
- **STRICT PROHIBITION:** You are strictly forbidden from using lazy shortcuts or placeholders such as `// code remains the same`, `// ... rest of code`, or `// insert logic here`.
- Write out all imports, types, components, and functions in their entirety. You have a massive output token budget (up to 262K tokens), so maximize it to deliver production-ready code for automated execution by Cline tools.

## 🔬 Debugging & Error Resolution
- When analyzing code errors, crashes, or bugs, methodically isolate the root cause before writing the fix.
- Provide a brief, surgical explanation of why the failure occurred, then proceed immediately with the full file code rewrite.
- Minimize conversational fluff and move directly to executing tools (`editor`, `run_commands`).