# OSS Warrior — Specification v0.1

> **Respect to every OSS warrior. Every contribution counts.**

OSS Warrior measures a GitHub account's open-source activity as a **power level**
across three combat domains, renders it as a shareable warrior card, and honors
both superhuman output and quiet, high-quality service. It is entertainment
built on honest, reproducible, public data.

All numbers are computed from public GitHub events only. Every figure on a card
can be traced back to public PRs, merges, and commits.

## 1. Leagues (combat domains)

Every measurable act belongs to exactly one league:

| League | Act | Unit |
|---|---|---|
| **CONTRIBUTOR** | your PR merged into an *external* repo (someone else's gate) | merged PR |
| **MAINTAINER** | you merge an *external human's* PR into a repo you keep | PR served |
| **SOLO** | commits to default branches of your *own* public repos | commit |

**Internality rule (merger rule):** a repo is *internal* to a user if the repo
owner is the user, the owner is one of the user's (public) orgs, or the user has
merged other people's PRs in that repo. Config may pin additional orgs
(private org membership is invisible to the API — see openclaw/steipete case).

**Bots are excluded everywhere** (`__typename == Bot` or login ending in
`bot` / `[bot]`).

## 2. Arena weight

```
w(repo) = log10(1 + stars + 50 × C_ext)
```

- `C_ext` ≈ number of repo contributors excluding the owner (API approximation:
  contributors count − 1, bot names excluded, capped at 500).
- Continuous — no tiers, no cliffs, no exponential steps.
- A young 0-star repo with a real community earns weight through `C_ext`;
  a fake or solo-only repo stays at `w = 0` (anti-cheat).
- Standard arena constant: `w0 = 3.0` (≈ a 1k-star community repo).

## 3. Power (achievement — absolute, never normalized across leagues)

```
CONTRIBUTOR power = 100 × Q² × Σ_(external repos, wins ≥ 2) √(w × wins)
MAINTAINER  power = 100 ×       Σ_(repo × external human author) √(w × PRs)
SOLO        power = 100 ×       Σ_(own public repos) √(w × commits)
TOTAL POWER = sum of the three
```

- `Q` = Wilson lower bound (z = 1.96) of merged / (merged + closed-unmerged)
  over *external* PRs created in the window. (v0 limitation: author-withdrawn
  PRs count as rejections; a later version will exclude self-closed PRs.)
- The **≥ 2 wins gate** applies to the contributor league only: a repo counts
  once you have landed at least two PRs there (anti drive-by).
- Power is the spectacle: farmers and Saiyans share one scale, uncorrected.

## 4. Rank (human work rate — fair, league-relative)

Rank is determined by **effective volume**, not power:

```
V_eff(league) = Σ_units count × √(w / w0)     (arena difficulty substitutes for volume)
```

Capacity ladder (counts per 90 days; league unit coefficients ×1 / ×2 / ×3):

| Rank | Metal | Contributor (×1) | Maintainer (×2) | Solo (×3) | Meaning |
|---|---|---|---|---|---|
| Rookie | BRONZE | 1 | 2 | 3 | you showed up — you're a warrior |
| Weekend Warrior | SILVER | 12 | 24 | 36 | 1–2 acts a week |
| Mainstay | GOLD | 60 | 120 | 180 | every weekday |
| Pro | PLATINUM | 180 | 360 | 540 | 2–3 every weekday |
| Super Warrior | DIAMOND | 900 | 1,800 | 2,700 | 5× pro — beyond unaided humans |
| AI Sorcerer | **MYTHIC** | 9,000 | 18,000 | 27,000 | 50× pro — *it's over 9000* |

- Overall rank = the highest league rank. Per-league ranks shown as ◆ marks.
- Thresholds are **capacity anchors** (human-time physics), not percentiles.
  They are constants; recalibration only when personas are revised (versioned).
- Rationale: maintaining is ~2× faster than authoring; commits are ~3× finer
  than merges.

## 5. Card grammar

- **Frame & interior tint** = overall rank metal (Bronze → Mythic rainbow).
- **Power number gradient** = metal of the *dominant* league (most power);
  single-league users see one color, multi-league users get a two-tone card.
- **Rank plaque** (embossed metal, top right): top two league ranks, e.g.
  `◆◆ MYTHIC + DIAMOND`. Second rank shown only if ≥ GOLD. ◆ count = ranks
  shown; double rank ⇒ double avatar ring + inner hairline frame.
- **DOUBLE CROWN** = two leagues at DIAMOND+. `DOUBLE MYTHIC` / `TRIPLE CROWN`
  are reserved legend tiers (no holder yet).
- **Affiliation line** (business-card style): `repo 383k★ — CONTRIBUTOR|FOUNDER|MAINTAINER`.
- **Persona line** under the plaque: e.g. `Sorcerer × Super Warrior`.
- Motto header: `OPEN SOURCE SOFTWARE WARRIOR`. Scan date bottom right.
- No progress bars on the card (business-card principle); progress lives in the
  README evaluation table.
- One fact appears exactly once on the card.
- English only. Copy celebrates; zero values render as `UNCHARTED`.

## 6. Badges & honors

- **Badges** = raw counters derived from the user's own history (quantity and
  conduct): `52 arena wins`, `84% merge rate`, `11-week merge streak`,
  `38 first-timers welcomed` (first PR to that repo), `553 commits shipped`.
  Admission test: *"if this number grows, OSS moved forward."*
  Rare glowing badges: `⚡ Limit Break` (measurement truncated by API limits),
  `⚔ Triple Wielder` (all three leagues ≥ Weekend).
- **Honors** = external recognition only (laurel chip `HONOR`): Community
  Funded (GitHub Sponsors), Digital Public Good (DPGA registry), Foundation
  Graduate (CNCF/Apache/LF), GitHub Star (official roster), Cited by Science,
  Security Credit. Admission test: *"attested by a third party or by the
  crowd's voluntary act."* v0 ships Community Funded only.

## 7. Windows

- Default window: trailing **90 days**.
- Named periods (e.g. `2025`) are supported by linearly scaling raw counts to
  a 90-day equivalent **before** applying formulas (√ makes post-hoc scaling
  invalid). Cards state the period.

## 8. v0 limitations (documented honestly)

- Private activity is invisible (public game only).
- Direct-push/off-GitHub workflows under-measure (Torvalds/Evan You effect).
- Maintainer arena discovery scans the user's own + public-org repos
  (most recently pushed, capped); org membership privacy can misclassify.
- Q counts self-withdrawn PRs as rejections.
- Hyperactive accounts may exceed API resource limits → lower bound shown,
  celebrated as `⚡ Limit Break`.
