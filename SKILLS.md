# Skills Planning and Audit Instructions

## Objective

Identify the smallest useful set of reusable Agent Skills for the Personal Expense Tracker MVP.

Do not create skills merely to increase the number of files. Every proposed skill must provide a repeatable procedure that is not already adequately covered by the project's instructions or rules.

## Required Source Review

Before recommending any skills, read the complete contents of:

1. `PRD.md`
2. `AGENTS.md`
3. `RULES.md`
4. Every supporting rule file listed in `RULES.md`, including all 13 files inside `rules/`

Verify that all listed rule files exist and can be read. If any required file is missing, unreadable, or inconsistent, report the issue and stop the skills assessment until it is resolved.

Do not assume file contents based on filenames. Do not invent requirements or silently resolve contradictions.

## What Qualifies as a Skill?

Recommend a skill only when it meets these criteria:

- It describes a repeatable, multi-step workflow.
- It has a clear trigger or situation in which the workflow should be used.
- The order of its steps matters to producing a reliable result.
- An agent could easily omit an important step without the procedure.
- The workflow is not already adequately documented in `AGENTS.md` or the supporting rules.
- It supports the approved MVP or a necessary preparation step.

## What Does Not Qualify?

Do not create a skill for:

- A single action or simple instruction.
- A rule that merely says what must or must not be done.
- General coding advice already covered by project instructions.
- A workflow that will only be performed once during initial setup.
- Optional features outside the approved MVP.
- Procedures that duplicate another proposed skill.
- Authentication implementation details that have not yet been supplied or approved.

## Assessment Process

1. Read all required source files.
2. Extract the project's actual recurring or repeatable workflows.
3. Compare each candidate against the qualification criteria.
4. Identify overlap with `AGENTS.md` and every supporting rule.
5. Reject weak, redundant, speculative, or unnecessary candidates.
6. Recommend only the skills that provide clear additional value.
7. Explain the purpose and trigger for each recommended skill.
8. Report any important workflow that is not suitable for a skill and explain briefly why.

Do not create or modify any skill files during this assessment.

## Output Format

Provide:

### A. Source Audit
Confirm which required files were read and identify any missing files, contradictions, or unresolved issues.

### B. Skill Candidates
For each recommended skill, provide:
- Proposed skill name
- The situation that triggers it
- The repeatable steps it should guide
- Why the workflow deserves a dedicated skill
- Which existing rules it must reference rather than duplicate

### C. Rejected Candidates
List only meaningful candidates that were rejected, with a brief reason.

### D. Final Recommendation
Present the smallest useful set of approved candidates. If no skill is justified, explain why rather than inventing one.

Wait for approval before creating any skill directories or `SKILL.md` files.

## Skill File Requirements

After approval, create one directory per approved skill. Each directory must contain a `SKILL.md` file.

The `SKILL.md` file must begin with YAML frontmatter containing only these two fields:

- `name`
- `description`

The remaining content should document the actual workflow steps, decision points, verification steps, and relevant references to existing project rules.

Do not copy entire rules into a skill. Reference the relevant rule files instead.

Do not implement application features, install dependencies, modify the database, or change the project's configuration during the skills-planning stage.

## Final Verification

Before finishing, verify that:
- Every approved skill has a distinct purpose.
- No skill contradicts the PRD or existing project instructions.
- No skill duplicates the supporting rules.
- Each skill has a clear trigger and repeatable workflow.
- No unapproved skill files have been created.
