# Custom Core Rules for Qwen3 & Laguna Dynamic Router

## Code Generation (Targeting Qwen3 Coder Heavy Capacity)
- When building, rewriting, or refactoring code, always output the FULL file structure. Do not use placeholders like "// code remains the same". You have an expansive output token budget (up to 262K tokens), so maximize it to deliver complete, production-ready files.
- Ensure all modular functions are written out entirely to facilitate seamless automated tool application by Cline.

## Error Investigation & Debugging (Targeting Laguna Reasoning)
- When analyzing code errors, crashes, or bugs, leverage your advanced inner chain-of-thought processing.
- Be highly targeted and analytical. Pinpoint the exact line of failure, explain *why* it failed concisely, and execute a surgical rewrite of the affected block to keep the response within optimal token lengths.
- Minimize conversational fluff; move immediately to executing tools (`editor`, `run_commands`) once the logic is verified.