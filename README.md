# ⚡ OSS Warrior

> **Respect to every OSS warrior. Every contribution counts.**

Measure any GitHub account's OSS power level across three combat domains
(CONTRIBUTOR / MAINTAINER / SOLO), rendered as a shareable warrior card.
Built entirely on public GitHub data — every number is reproducible.

## Quick scan (CLI)

```bash
GITHUB_TOKEN=$(gh auth token) node src/cli.js <login>
node src/cli.js <login> --year 2025          # season card (90d-normalized)
node src/cli.js <login> --own-orgs mycorp    # pin private org membership
```

Outputs `out/<login>/card.svg`, `table.md`, `data.json`.

## Design

See [SPEC.md](./SPEC.md) — formulas, capacity ladder (Rookie → **AI Sorcerer,
over 9000**), metals, badges, honors, and the honesty rules.

## Status

Private preview (v0). GitHub Action + Pages share flow coming next.
