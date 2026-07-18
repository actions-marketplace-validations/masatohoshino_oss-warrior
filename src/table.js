// README evaluation table (the pilot's dashboard — progress lives here, not on the card).
import { LADDER, COEF } from './score.js';

const fmt = (n) => Math.round(n).toLocaleString('en-US');

export function table(p) {
  const rows = Object.entries(p.leagues).map(([name, l]) => {
    const coef = COEF[name];
    const rank = l.rank >= 0 ? `${LADDER[l.rank].metal} (${LADDER[l.rank].persona})` : 'UNCHARTED';
    let next = '—';
    if (l.rank < LADDER.length - 1) {
      const target = LADDER[l.rank + 1];
      const need = target.n * coef;
      const pct = l.eff > 0 ? Math.min(99, Math.round(100 * l.eff / need)) : 0;
      next = `${target.metal} at ${fmt(need)} eff (${pct}%)`;
    }
    return `| ${name.toUpperCase()} | ${fmt(l.power)} | ${fmt(l.eff)} | ${rank} | ${next} |`;
  });

  const badges = p.badges.map((b) =>
    `- ${b.n !== undefined ? `**${b.n}**${b.glue ? '' : ' '}${b.text}` : `**${b.text}**`}`);
  const honors = p.honors.map((h) => `- ⚜ **${h.name}** — ${h.detail}`);

  return `### Warrior status — \`${p.login}\`

| League | Power | Effective volume | Rank | Next rank |
|---|---:|---:|---|---|
${rows.join('\n')}

**Total power: ${fmt(p.total)}** · total effort ${fmt(p.effTotal)} merge-eq${(() => {
    const i = p.overall ? LADDER.findIndex((l) => l.metal === p.overall.metal) : -1;
    if (i >= LADDER.length - 1) return ' (MAX RANK)';
    const t = LADDER[i + 1];
    return ` → ${t.metal} at ${fmt(t.n)} (${Math.min(99, Math.round(100 * p.effTotal / t.n))}%)`;
  })()} · window ${p.window.from} → ${p.window.to} (90d-normalized ×${p.window.norm.toFixed(2)})

${honors.length ? `**Honors**\n${honors.join('\n')}\n` : ''}
**Badges**
${badges.join('\n') || '- First scan — the journey begins'}

<sub>Every figure derives from public GitHub events. Formulas: [SPEC](./SPEC.md).</sub>
`;
}
