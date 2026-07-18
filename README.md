# ⚡ OSS Warrior

> **Respect to every OSS warrior. Every contribution counts.**

Measure any GitHub account's **OSS power level** across three combat domains —
**CONTRIBUTOR** (PRs merged through other people's gates), **MAINTAINER**
(external PRs you merged for others), **SOLO** (building your own public
projects) — and wear it as a living warrior card on your profile.

Built entirely on **public GitHub events**. Every number on every card is
reproducible by anyone. No sign-up, no server, no tracking: your card lives in
your own repo, served by your own GitHub Pages.

## Live sample

[![OSS Warrior card](https://raw.githubusercontent.com/masatohoshino/masatohoshino/main/warrior/card.svg)](https://github.com/masatohoshino)

*(a real card, auto-updated weekly — tap the card on the
[profile](https://github.com/masatohoshino) to post it to X)*

## 🔍 Try the scouter right now

Point the scouter at **any** GitHub account — no setup needed:

- **Console**: <https://masatohoshino.github.io/masatohoshino/scouter.html>
  — type a username, press **SCAN**
- **Or open an issue directly**:
  [`scan: <login>`](https://github.com/masatohoshino/masatohoshino/issues/new?title=scan%3A%20)
  — put the account name after `scan:` in the title and submit

The scouter replies on the issue in a couple of minutes with the power card,
an X share link, and a share page.

## Ranks

Thresholds are **capacity anchors** — how much a human can do per 90 days —
so their meaning never drifts:

| Rank | Metal | Persona |
|---|---|---|
| Rookie | BRONZE | you showed up — you're a warrior |
| Weekend Warrior | SILVER | 1–2 contributions a week |
| Mainstay | GOLD | every weekday |
| Pro | PLATINUM | 2–3 every weekday — *the pre-AI ceiling* |
| Super Warrior | DIAMOND | 5× pro — beyond unaided humans |
| **AI Sorcerer** | **MYTHIC** | 50× pro — ***it's over 9000*** |

Full formulas, arena weights, badges, honors, and honesty rules: [SPEC.md](./SPEC.md).

## Get your own card (5 minutes)

1. **Create your profile repo** — a public repo named exactly like your
   username (`<you>/<you>`).
2. **Add the workflow** — copy
   [`examples/workflow.yml`](./examples/workflow.yml) to
   `.github/workflows/oss-warrior.yml` in that repo. It runs weekly and on
   demand:

   ```yaml
   - uses: masatohoshino/oss-warrior@main
     # with:
     #   own-orgs: my-private-org   # pin orgs with private membership
   ```

3. **Enable Pages** — Settings → Pages → Source: **GitHub Actions**
   (the workflow also tries to enable it automatically).
4. **Run it** — Actions → OSS Warrior → *Run workflow*. Your README now shows
   your card; tapping it opens a pre-filled X post whose link unfurls the
   card image.
5. **Click “Share to profile”** — GitHub shows this banner on the repo the
   first time; your card won't appear on your profile page until you click it.

Already have a profile README? The card is maintained strictly between
`<!-- oss-warrior:start -->` / `<!-- oss-warrior:end -->` markers — nothing
else is ever touched. Place an empty marker pair anywhere to choose the
position.

**Your own scouter console**: also copy
[`examples/scouter-scan.yml`](./examples/scouter-scan.yml) — visitors to your
profile can then scan any account through your Pages console
(`…/scouter.html`), and the results land in your issues, never in your README.

## CLI

```bash
GITHUB_TOKEN=$(gh auth token) node src/cli.js <login>
node src/cli.js <login> --year 2025      # season card (90-day-normalized)
```

Outputs `out/<login>/card.svg`, `table.md`, `data.json`.

## Honesty rules (the short version)

- Public events only; private work is invisible by design.
- Unknown repos score zero (fake arenas don't work); star-count influence is
  logarithmic (buying stars doesn't either).
- Hyperactive accounts can exceed GitHub API limits: the card then shows a
  lower bound and wears **⚡ Limit Break** — in the best scouter tradition.
- Known limitations are documented in [SPEC.md §8](./SPEC.md), not hidden.

## License

[MIT](./LICENSE) — *every contribution counts.*
