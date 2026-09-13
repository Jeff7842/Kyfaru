---
name: installed-pdf2plot
description: Record of the pdf2plot skill installed into this project on 2026-09-12
metadata:
  type: project
---

Installed the `pdf2plot` skill at `F:\Web Dev\Kyfaru\.claude\skills\pdf2plot\SKILL.md`, fetched from https://github.com/adamkucharski/pdf2plot.git (MIT license, Adam Kucharski). It extracts numeric data from vector PDF figures (line/scatter charts) into CSV, purely via PDF geometry (PyMuPDF vector paths + text-layer axis labels) — no image inspection, no network calls. Invoked as `/pdf2plot path/to/figure.pdf`; on first run it writes a bundled `pdf2plot_helper.py` to the current working directory, requires `pip install pymupdf` (required) and `pip install matplotlib` (optional, for a verification plot).

**Why:** User wanted better PDF extraction/analysis capability going forward, specifically for pulling data out of chart/figure PDFs rather than just text PDFs.

**How to apply:** When the user has a PDF with a chart/plot and wants the underlying data points (not just text extraction), point them at this skill instead of ad hoc PDF parsing code. See [[install-location]] for where it lives and [[github-repo-skill-fetch]] for how it was fetched, in case it needs updating from upstream later.
