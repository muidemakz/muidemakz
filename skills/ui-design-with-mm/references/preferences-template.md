# Per-user preference file

Read when initializing the file, recording feedback, or handling a storage limitation. Read the actual preference file at the beginning of every run.

Use `preferences.md` beside `SKILL.md` in a private personal installation unless the user explicitly supplies another private location. Resolve relative paths from the skill directory, not the current project. Never search other users' files or silently use a shared repository as personal storage.

Start empty. The shared methodology is the same for everyone; the creator's personal taste is not a default for adopters. If the user wants to import earlier preferences, have them identify the feedback to carry over and preserve its scope.

## Empty file template

```markdown
# Personal preferences

Applies only to this user's runs. Brand and research come first; accessibility checks always apply.

No preferences recorded yet.

## Feedback entries
```

## Append a human-provided entry

```markdown
### [date] - [short topic]
- Scope: [all projects only if explicit, otherwise named product or current context]
- Feedback: [faithful short quote or paraphrase of the user's feedback]
- Preference: [what to favor or avoid within that scope]
- Conditions: [limits stated by the user, or none stated]
- Supersedes: [earlier entry only if the user explicitly changed it, otherwise none]
```

A viewing setting such as the Figma canvas background color is a valid entry (scope: all projects, preference: the color, applied to pages the skill creates). Replace brackets with real feedback. Remove the empty-state sentence on the first append. Do not invent a preference, strength, audience, or scope from generated work or from praise the user did not give. Keep project-specific feedback specific; ask when scope is genuinely unclear. Preserve previous entries unless the user asks to edit or clear them. Do not silently resolve contradictory feedback; use the choice layer when it matters.

Read before writing and confirm the resulting entry is saved. Never overwrite `SKILL.md`, shared references, or an existing personal file with the template. Tell the user the saved summary and location. Respect a request to stop recording; record no further feedback while it applies.

If local persistence is unavailable, state that limitation. Use only preferences actually available in the session. Offer the proposed entry as text for the user to save locally, without claiming cross-session memory or uploading it elsewhere. A missing file means no stored preferences; it is not permission to infer them.

Keep the file private and excluded from commits, archives for sharing, Figma content, and research queries. No collection, telemetry, export, or sync is implemented. Applying preferences in model context remains subject to the chosen assistant's normal data handling; this file does not make inference offline.
