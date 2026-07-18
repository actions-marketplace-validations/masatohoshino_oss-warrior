// Formulas v2, ranks, badges, honors (SPEC §2–§6).

export const W0 = 3.0;
export const LADDER = [
  { persona: 'Rookie', metal: 'BRONZE', n: 1 },
  { persona: 'Weekend Warrior', metal: 'SILVER', n: 12 },
  { persona: 'Mainstay', metal: 'GOLD', n: 60 },
  { persona: 'Pro', metal: 'PLATINUM', n: 180 },
  { persona: 'Super Warrior', metal: 'DIAMOND', n: 900 },
  { persona: 'AI Sorcerer', metal: 'MYTHIC', n: 9000 },
];
export const COEF = { contributor: 1, maintainer: 2, solo: 3 };
export const METALS = {
  NONE: { rank: '#3d4552', f1: '#262b33', f2: '#262b33', f3: '#262b33' },
  BRONZE: { rank: '#b0713a', f1: '#d9a06b', f2: '#6e4522', f3: '#c08a52' },
  SILVER: { rank: '#aab3c0', f1: '#e2e7ee', f2: '#6f7885', f3: '#c5ccd6' },
  GOLD: { rank: '#d4af37', f1: '#f3dc9a', f2: '#8a6614', f3: '#e7c368' },
  PLATINUM: { rank: '#9fd0d6', f1: '#eaf6f8', f2: '#5f939b', f3: '#c3e2e6' },
  DIAMOND: { rank: '#7fc4f0', f1: '#dff2ff', f2: '#3f7fb4', f3: '#a8dcff' },
  MYTHIC: { rank: '#b9a5f2', f1: '#ffd9a0', f2: '#8f7fd4', f3: '#8fd4f0' },
};

export const wOf = (stars, cext) => Math.log10(1 + (stars || 0) + 50 * (cext || 0));

export function wilson(k, n, z = 1.96) {
  if (n === 0) return 0;
  const p = k / n, d = 1 + z * z / n, c = p + z * z / (2 * n);
  const m = z * Math.sqrt((p * (1 - p) + z * z / (4 * n)) / n);
  return Math.max(0, (c - m) / d);
}

function rankOf(league, effVolume) {
  const coef = COEF[league];
  let idx = -1;
  for (let i = 0; i < LADDER.length; i++) {
    if (effVolume >= LADDER[i].n * coef) idx = i;
  }
  return idx; // -1 = uncharted
}

export function score(raw) {
  const { norm } = raw.window;
  const w = (repo) => wOf(raw.meta.stars[repo], raw.meta.cext[repo]);

  // contributor (≥2 wins gate for power AND effective volume)
  const c = raw.contributor;
  const q = wilson(c.qWins, c.qWins + c.qLosses);
  const gated = Object.entries(c.extRepos)
    .map(([repo, v]) => ({ repo, count: v.count * c.scale * norm, w: w(repo) }))
    .filter((r) => r.count >= 2 && r.w > 0);
  const cPower = 100 * q * q * gated.reduce((s, r) => s + Math.sqrt(r.w * r.count), 0);
  const cEff = gated.reduce((s, r) => s + r.count * Math.sqrt(r.w / W0), 0);

  // maintainer (repo × external human author pairs)
  const pairs = Object.entries(raw.maintainer.served)
    .map(([k, count]) => {
      const repo = k.split('|')[0];
      return { repo, author: k.split('|')[1], count: count * norm, w: w(repo) };
    }).filter((p) => p.w > 0);
  const mPower = 100 * pairs.reduce((s, p) => s + Math.sqrt(p.w * p.count), 0);
  const mEff = pairs.reduce((s, p) => s + p.count * Math.sqrt(p.w / W0), 0);
  const challengers = new Set(pairs.map((p) => p.author)).size;
  const servedPRs = Math.round(pairs.reduce((s, p) => s + p.count, 0));

  // solo
  const solo = Object.entries(raw.solo.repos)
    .map(([repo, v]) => ({ repo, count: v.commits * norm, w: w(repo) }))
    .filter((r) => r.w > 0);
  const sPower = 100 * solo.reduce((s, r) => s + Math.sqrt(r.w * r.count), 0);
  const sEff = solo.reduce((s, r) => s + r.count * Math.sqrt(r.w / W0), 0);

  const leagues = {
    contributor: { power: cPower, eff: cEff, rank: rankOf('contributor', cEff), q,
      wins: Math.round(gated.reduce((s, r) => s + r.count, 0)), repos: gated },
    maintainer: { power: mPower, eff: mEff, rank: rankOf('maintainer', mEff),
      servedPRs, challengers, repos: pairs },
    solo: { power: sPower, eff: sEff, rank: rankOf('solo', sEff),
      commits: Math.round(solo.reduce((s, r) => s + r.count, 0)), repos: solo },
  };
  const total = cPower + mPower + sPower;

  // overall rank = combined effort in merge-equivalents (SPEC §4 rev. 2026-07-18):
  // per-league coefficients are unit conversions, so total effort is their sum.
  const effTotal = cEff / COEF.contributor + mEff / COEF.maintainer + sEff / COEF.solo;
  let overallIdx = -1;
  for (let i = 0; i < LADDER.length; i++) if (effTotal >= LADDER[i].n) overallIdx = i;
  const overall = overallIdx >= 0 ? LADDER[overallIdx] : null;
  const crowns = Object.values(leagues).filter((l) => l.rank >= 4).length;
  const dominant = Object.entries(leagues).sort((a, b) => b[1].power - a[1].power)[0];

  // affiliation: strongest single repo term across leagues
  const allTerms = [
    ...gated.map((r) => ({ ...r, role: 'CONTRIBUTOR' })),
    ...pairs.map((p) => ({ repo: p.repo, count: p.count, w: p.w, role: 'MAINTAINER' })),
    ...solo.map((r) => ({ ...r, role: 'FOUNDER' })),
  ].sort((a, b) => Math.sqrt(b.w * b.count) - Math.sqrt(a.w * a.count));
  const affTop = allTerms[0] || null;
  const affiliation = affTop && {
    repo: affTop.repo,
    stars: raw.meta.stars[affTop.repo] || 0,
    role: affTop.repo.split('/')[0].toLowerCase() === raw.login.toLowerCase()
      ? 'FOUNDER' : affTop.role,
    extraArenas: new Set(allTerms.map((t) => t.repo)).size - 1,
  };

  // badges (counters) + rare
  const badges = [];
  if (Object.values(leagues).filter((l) => l.rank >= 1).length === 3) {
    badges.push({ rare: true, text: '⚔ Triple Wielder' });
  }
  if (c.truncated || raw.solo.truncated) {
    badges.push({ rare: true, text: '⚡ Limit Break' });
  }
  if (leagues.contributor.wins) badges.push({ n: leagues.contributor.wins, text: 'arena wins' });
  if (c.qWins + c.qLosses >= 5) {
    badges.push({ n: `${Math.round(100 * c.qWins / (c.qWins + c.qLosses))}%`, text: 'merge rate' });
  }
  if (challengers) badges.push({ n: challengers, text: 'challengers served' });
  if (leagues.solo.commits) badges.push({ n: leagues.solo.commits, text: 'commits shipped' });
  if (raw.extras.streakWeeks >= 2) {
    badges.push({ n: raw.extras.streakWeeks, text: '-week merge streak', glue: true });
  }

  const honors = [];
  if (raw.extras.sponsors > 0) {
    honors.push({ name: 'Community Funded',
      detail: `backed by ${raw.extras.sponsors} sponsor${raw.extras.sponsors > 1 ? 's' : ''}` });
  }

  return {
    login: raw.login, avatar: raw.avatar, scannedAt: raw.scannedAt, window: raw.window,
    total, leagues, effTotal, overall, pips: crowns >= 2 ? 2 : 1, crowns,
    dominant: { league: dominant[0], metal: dominant[1].rank >= 0 ? LADDER[dominant[1].rank].metal : 'NONE' },
    affiliation, badges: badges.slice(0, 5), honors,
    persona: overall ? overall.persona : 'First scan — the journey begins',
  };
}
