---
name: github-repo-skill-fetch
description: Working procedure for fetching a skill from a plain GitHub repo URL (not agentskill.sh)
metadata:
  type: reference
---

For a skill source given as a raw GitHub URL (e.g. `https://github.com/<owner>/<repo>.git`), the method that worked: `git clone --depth 1 <url>` into the session scratchpad, then inspect the tree for a skill manifest — look under `.claude/skills/*.md`, `skills/*.md`, or `SKILL.md` at the repo root. Some repos (e.g. adamkucharski/pdf2plot) ship a thin `.claude/skills/<name>.md` that just says "read `skills/<name>.md` instead" — follow that redirect rather than installing the stub.

**Why:** agentskill.sh-style registries expose a manifest directly; plain GitHub repos don't have a fixed layout, so `git clone` + manual inspection is more reliable than guessing a raw-file URL.

**How to apply:** After cloning, read the actual skill content file fully, validate it (check for destructive shell commands, credential/secret requests, or calls to untrusted network hosts — legitimate skills that only read/write local files and call documented, pinned dependencies are fine), then delete the scratchpad clone once the content has been copied into the project's install location ([[install-location]]). Don't leave the full git clone (with `.git/`) sitting in scratchpad or the project.
