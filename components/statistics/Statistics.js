"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

import { fetchExpenses } from "@/lib/store/slices/expenses";
import { amountToCurrency } from "@/utils/amountToCurrency";

const PIE_COLORS = [
  "#ba80f8",
  "#e17c55",
  "#e0bed3",
  "#e9e577",
  "#a7bada",
  "#80ba9d",
  "#a97e6e",
  "#c4bef1",
  "#e8b379",
  "#62e8a5",
];
const UNCATEGORIZED_LABEL = "Sans catégorie";
const UNCATEGORIZED_COLOR = "#a1a1aa";
const SIZE = 220;
const R = 80;
const STROKE = 36;
const GAP = 2;

export default function Statistics({ groupId }) {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.items);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchExpenses({ groupId }));
    }
  }, [dispatch, groupId]);

  const totals = new Map();
  for (const expense of expenses) {
    const label = expense.category || UNCATEGORIZED_LABEL;
    totals.set(label, (totals.get(label) || 0) + (expense.amount || 0));
  }

  const slices = [...totals.entries()]
    .map(([label, amount]) => ({ label, amount }))
    .sort((a, b) => b.amount - a.amount);

  const total = slices.reduce((sum, slice) => sum + slice.amount, 0);

  function computeArcs() {
    const circumference = 2 * Math.PI * R;
    let cumulative = 0;

    return slices.map((slice, index) => {
      const fraction = total > 0 ? slice.amount / total : 0;
      const startAngle = cumulative;
      const length = circumference * fraction;
      const dash = Math.max(length - GAP, 0.5);
      cumulative += fraction * 360;

      return {
        ...slice,
        fraction,
        percent: fraction * 100,
        color:
          slice.label === UNCATEGORIZED_LABEL
            ? UNCATEGORIZED_COLOR
            : PIE_COLORS[index % PIE_COLORS.length],
        startAngle,
        dash,
        circumference,
      };
    });
  }

  const arcs = computeArcs();
  const center = SIZE / 2;

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-4 flex flex-col">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="w-full flex items-center gap-2 cursor-pointer text-left"
      >
        <span className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 grow">
          Statistiques
        </span>
        {isOpen ? (
          <ChevronUpIcon className="size-5 text-zinc-500 dark:text-zinc-400" />
        ) : (
          <ChevronDownIcon className="size-5 text-zinc-500 dark:text-zinc-400" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {expenses.length === 0 ? (
            <p className="text-center text-zinc-500 italic dark:text-zinc-400">
              Aucune dépense pour le moment.
            </p>
          ) : (
            <>
              <div className="relative w-fit mx-auto">
                <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                  {arcs.map((arc) => (
                    <circle
                      key={arc.label}
                      cx={center}
                      cy={center}
                      r={R}
                      fill="none"
                      stroke={arc.color}
                      strokeWidth={STROKE}
                      strokeDasharray={`${arc.dash} ${arc.circumference - arc.dash}`}
                      transform={`rotate(${arc.startAngle - 90} ${center} ${center})`}
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Total
                  </span>
                  <span className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                    {amountToCurrency(total)}
                  </span>
                </div>
              </div>

              <ul className="space-y-2">
                {arcs.map((arc) => (
                  <li
                    key={arc.label}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span
                      className="size-3 rounded-full shrink-0"
                      style={{ backgroundColor: arc.color }}
                    />
                    <span className="grow truncate text-zinc-700 dark:text-zinc-200">
                      {arc.label}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {arc.percent.toFixed(1).replace(".", ",")} %
                    </span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-100">
                      {amountToCurrency(arc.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
