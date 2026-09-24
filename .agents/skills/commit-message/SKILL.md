---
name: commit-message
description: Generates, formats, or prepares Git commit messages strictly adhering to repository conventions and GEMINI.md guidelines. Use whenever the user asks for a commit message, wants to commit changes, or asks for staged change summaries.
---

# Git Commit Message Generator Skill

This skill guides the generation of commit messages that strictly follow the project's commit message standard defined in [GEMINI.md](../../../GEMINI.md).

---

## Instructions

When generating a commit message or staging/committing changes:

1. **Inspect Staged/Modified Changes**:
   - Check staged changes (`git diff --cached`) or working tree status (`git status`).
   - If no changes are staged, inspect unstaged changes or ask to stage the relevant files.

2. **Template**:
   ```text
   Type: description in 1-2 sentences.
   ```

3. **Allowed Types (Capitalized with colon and space)**:
   - **`Global`**: Changes touching multiple sandboxes, root `Makefile`, or multi-environment orchestration.
   - **`Documentation`**: Updates to documentation, guides, READMEs, comments, or docstrings.
   - **`Configuration`**: Language versions (`.tool-versions`), build scripts (`build.gradle.kts`, `package.json`, `Gemfile`), and environment setups.
   - **`Feature`**: Adding new functionality, algorithms, or capabilities within a language sandbox.
   - **`Fix`**: Bug fixes, runtime error corrections, and resolving broken scripts.
   - **`Refactor`**: Code restructuring, modularization, or cleanup without adding features or fixing bugs.
   - **`Style`**: Formatting, whitespace adjustments, indentation, or console output styling.

4. **Formatting Constraints**:
   - **Prefix**: Exactly `Type: ` (e.g. `Feature: `, `Fix: `). Do NOT use lowercase or backticks/brackets around the type.
   - **Length**: Exactly 1 to 2 sentences describing the change and its intent.
   - **No Extra Bloat**: Do NOT add markdown headers, bullet point lists, or footer metadata.
