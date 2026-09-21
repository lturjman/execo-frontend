"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

import { fetchExpenses } from "@/lib/store/slices/expenses";
import { amountToCurrency } from "@/utils/amountToCurrency";
import { EXPENSE_CATEGORIES } from "@/utils/expenseCategories";

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

function expenseMonthKey(expense) {
  const date = new Date(expense.paymentDate || expense.createdAt);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(monthKey) {
  if (!monthKey) return "";
  const [year, month] = monthKey.split("-").map(Number);
  const label = new Date(year, month - 1, 1).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function buildSlices(expenseList) {
  const totals = new Map();
  for (const expense of expenseList) {
    const label = expense.category || UNCATEGORIZED_LABEL;
    totals.set(label, (totals.get(label) || 0) + (expense.amount || 0));
  }

  return [...totals.entries()]
    .map(([label, amount]) => ({ label, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export default function Statistics({ groupId }) {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.items);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("total");
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchExpenses({ groupId }));
    }
  }, [dispatch, groupId]);

  const months = useMemo(() => {
    const buckets = new Map();
    for (const expense of expenses) {
      const key = expenseMonthKey(expense);
      const bucket = buckets.get(key) || { key, expenses: [] };
      bucket.expenses.push(expense);
      buckets.set(key, bucket);
    }
    return [...buckets.values()]
      .map((bucket) => ({
        ...bucket,
        total: bucket.expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0),
      }))
      .sort((a, b) => b.key.localeCompare(a.key));
  }, [expenses]);

  useEffect(() => {
    if (view === "month" && !selectedMonth && months.length > 0) {
      setSelectedMonth(months[0].key);
    }
  }, [view, selectedMonth, months]);

  const monthBuckets = useMemo(() => {
    const buckets = new Map(
      months.map((month) => [month.key, month.expenses]),
    );
    return buckets.get(selectedMonth) || [];
  }, [months, selectedMonth]);

  const totalSlices = useMemo(() => buildSlices(expenses), [expenses]);
  const monthSlices = useMemo(() => buildSlices(monthBuckets), [monthBuckets]);

  const slices = view === "total" ? totalSlices : monthSlices;
  const total = slices.reduce((sum, slice) => sum + slice.amount, 0);

  const colorMap = useMemo(() => {
    const known = [...new Set(EXPENSE_CATEGORIES)].sort();
    const extra = [...new Set(expenses.map((e) => e.category))]
      .filter((category) => category && !known.includes(category))
      .sort();
    const labels = [...known, ...extra, UNCATEGORIZED_LABEL];

    const map = { [UNCATEGORIZED_LABEL]: UNCATEGORIZED_COLOR };
    let colorIndex = 0;
    for (const label of labels) {
      if (label !== UNCATEGORIZED_LABEL) {
        map[label] = PIE_COLORS[colorIndex % PIE_COLORS.length];
        colorIndex += 1;
      }
    }
    return map;
  }, [expenses]);

  function computeArcs(arcSlices) {
    const circumference = 2 * Math.PI * R;
    let cumulative = 0;

    return arcSlices.map((slice) => {
      const fraction = total > 0 ? slice.amount / total : 0;
      const startAngle = cumulative;
      const length = circumference * fraction;
      const dash = Math.max(length - GAP, 0.5);
      cumulative += fraction * 360;

      return {
        ...slice,
        fraction,
        percent: fraction * 100,
        color: colorMap[slice.label],
        startAngle,
        dash,
        circumference,
      };
    });
  }

  const arcs = computeArcs(slices);
  const center = SIZE / 2;
  const activeExpenses = view === "total" ? expenses : monthBuckets;
  const centerLabel = view === "month" ? monthLabel(selectedMonth) : "Depuis la création";

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
              <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-700 p-1">
                <button
                  type="button"
                  onClick={() => setView("total")}
                  className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition ${
                    view === "total"
                      ? "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 shadow"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  Total
                </button>
                <button
                  type="button"
                  onClick={() => setView("month")}
                  className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition ${
                    view === "month"
                      ? "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 shadow"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  Par mois
                </button>
              </div>

              {view === "month" && months.length > 0 && (
                <div>
                  <label htmlFor="month-select" className="sr-only">
                    Choisir le mois à afficher
                  </label>
                  <select
                    id="month-select"
                    value={selectedMonth || ""}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full rounded-md bg-zinc-100 dark:bg-zinc-700 p-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-400"
                  >
                    {months.map((month) => (
                      <option key={month.key} value={month.key}>
                        {monthLabel(month.key)} — {amountToCurrency(month.total)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 text-center leading-tight">
                    {centerLabel}
                  </span>
                  <span className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                    {amountToCurrency(total)}
                  </span>
                </div>
              </div>

              {activeExpenses.length === 0 ? (
                <p className="text-center text-zinc-500 italic dark:text-zinc-400">
                  Aucune dépense sur cette période.
                </p>
              ) : (
                <ul className="space-y-2">
                  {arcs.map((arc) => (
                    <li
                      key={`${selectedMonth || "total"}-${arc.label}`}
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
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}