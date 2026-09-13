---
name: install-location
description: Canonical skill install directory and layout convention for the Kyfaru project
metadata:
  type: project
---

This project (F:\Web Dev\Kyfaru) had no `.claude/skills/` or `skills/` directory before 2026-09-12. The convention adopted: install each skill as `.claude/skills/<skill-name>/SKILL.md`, using standard Claude Code Skill frontmatter (`name`, `description`, optionally `license`/`source`) even if the upstream source didn't ship it that way.

**Why:** Claude Code discovers skills via YAML-frontmatter `SKILL.md` files under `.claude/skills/<name>/`. Auto-discovery needs the `description` field to decide relevance, so a skill body with no frontmatter (just a heading) won't surface itself correctly.

**How to apply:** For future skill installs in this project, target `.claude/skills/<skill-name>/SKILL.md`. If the upstream repo's skill file lacks frontmatter, add it (name = skill slug, description = one line covering what it does + when to invoke it) rather than copying the file verbatim. See [[github-repo-skill-fetch]] for the fetch procedure and [[installed-pdf2plot]] for a worked example.
