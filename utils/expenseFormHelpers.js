import { Decimal } from "decimal.js";

export function rescaleTo100(pcts, ids) {
  const newPcts = { ...pcts };
  const total = ids.reduce((sum, id) => sum + (newPcts[id] || 0), 0);
  if (total > 0 && Math.abs(total - 100) > 0.01) {
    const factor = 100 / total;
    ids.forEach((id) => {
      newPcts[id] *= factor;
    });
  }
  return newPcts;
}

export function rescaleOthers(newPcts, editedId, checkedIds) {
  const otherIds = checkedIds.filter((id) => id !== editedId);
  if (otherIds.length === 0) return newPcts;

  const remainder = Math.max(0, 100 - newPcts[editedId]);
  const othersTotal = otherIds.reduce((sum, id) => sum + (newPcts[id] || 0), 0);

  if (othersTotal > 0 && remainder > 0) {
    const factor = remainder / othersTotal;
    otherIds.forEach((id) => {
      newPcts[id] *= factor;
    });
  } else if (remainder > 0) {
    const equal = remainder / otherIds.length;
    otherIds.forEach((id) => {
      newPcts[id] = equal;
    });
  } else {
    otherIds.forEach((id) => {
      newPcts[id] = 0;
    });
  }

  return newPcts;
}

export function computeDebtsFromPercentages(pcts, totalAmount, checkedMembers) {
  if (!totalAmount || Number(totalAmount) <= 0 || checkedMembers.length === 0) {
    return checkedMembers.map((m) => ({ amount: "0", member: m }));
  }

  const total = new Decimal(totalAmount);
  const checkedTotal = checkedMembers.reduce(
    (sum, m) => sum + (pcts[m._id] || 0),
    0,
  );

  if (checkedTotal <= 0) {
    return checkedMembers.map((m) => ({ amount: "0", member: m }));
  }

  return checkedMembers.map((member) => {
    const pct = pcts[member._id] || 0;
    const normalizedPct = new Decimal(pct).div(checkedTotal);
    const amount = total.mul(normalizedPct);
    return { amount: amount.toString(), member };
  });
}

export function redistribute(others, remainingCents) {
  const weights = others.map((p) => ({
    ...p,
    weight: Math.round(p.amount * 100),
  }));
  const weightTotal = weights.reduce((sum, p) => sum + p.weight, 0);

  if (weightTotal <= 0) {
    const base = Math.floor(remainingCents / weights.length);
    const remainder = remainingCents - base * weights.length;
    return weights.map((p, i) => ({
      ...p,
      amount: (base + (i < remainder ? 1 : 0)) / 100,
    }));
  }

  const raw = weights.map((p) => p.weight * (remainingCents / weightTotal));
  let assigned = 0;

  const base = raw.map((v) => {
    const floor = Math.floor(v);
    assigned += floor;
    return { v, floor };
  });

  let rest = remainingCents - assigned;
  const sorted = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);

  for (let k = 0; k < sorted.length && rest > 0; k++, rest--) {
    base[sorted[k].i].floor += 1;
  }

  return weights.map((p, i) => ({ ...p, amount: base[i].floor / 100 }));
}