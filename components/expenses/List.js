"use client";

import { PencilIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { amountToCurrency } from "@/utils/amountToCurrency";
import { formatDate } from "@/utils/dateHelpers";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";

import Button from "@/components/Button";

import { fetchExpenses } from "@/lib/store/slices/expenses";

export default function ExpensesList() {
  const router = useRouter();

  const params = useParams();
  const id = params.groupId;

  const group = useSelector((state) =>
    state.groups.items.find((g) => g && g._id === id),
  );

  const expenses = useSelector((state) => state.expenses.items);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchExpenses({ groupId: id }));
  }, [dispatch, id]);

  const [showHistory, setShowHistory] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showHistory && !closing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showHistory, closing]);

  const closeHistory = () => {
    setClosing(true);
    setTimeout(() => {
      setShowHistory(false);
      setClosing(false);
    }, 200);
  };

  const sortedExpenses = expenses
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.paymentDate || a.createdAt);
      const dateB = new Date(b.paymentDate || b.createdAt);

      const dayA = dateA.setHours(0, 0, 0, 0);
      const dayB = dateB.setHours(0, 0, 0, 0);

      if (dayA !== dayB) return dayB - dayA;

      return (
        new Date(b.createdAt || b.paymentDate) -
        new Date(a.createdAt || a.paymentDate)
      );
    });

  const renderMobileCard = (expense) => (
    <div
      key={expense._id}
      className="flex items-center justify-between gap-3 py-4 border-b border-zinc-100 dark:border-zinc-700"
    >
      <div className="min-w-0 flex-1 space-y-1">
        <div className="font-medium truncate">{expense.name}</div>
        {expense.category && (
          <div className="text-xs text-zinc-400 uppercase tracking-wide">
            {expense.category}
          </div>
        )}
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {formatDate(expense.paymentDate || expense.createdAt)}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
          Payé par {expense.credits.map((credit) => credit.member.nickname).join(", ")}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="font-semibold whitespace-nowrap">
          {amountToCurrency(expense.amount)}
        </div>
        <button
          onClick={() =>
            router.push(`/groups/${expense.group}/expenses/${expense._id}`)
          }
          aria-label="Modifier la dépense"
        >
          <PencilIcon className="size-5 text-purple-400" />
        </button>
      </div>
    </div>
  );

  const renderDesktopRow = (expense) => (
    <tr key={expense._id}>
      <td className="p-2">
        <div>{expense.name}</div>
        {expense.category && (
          <div className="text-xs text-zinc-400 uppercase tracking-wide">
            {expense.category}
          </div>
        )}
      </td>

      <td className="p-2">{formatDate(expense.paymentDate || expense.createdAt)}</td>

      <td className="p-2 text-right">{amountToCurrency(expense.amount)}</td>

      <td className="p-2 text-right">
        {expense.credits.map((credit) => credit.member.nickname).join(", ")}
      </td>

      <td className="p-2">
        <button
          onClick={() =>
            router.push(`/groups/${expense.group}/expenses/${expense._id}`)
          }
        >
          <PencilIcon className="size-5 text-purple-400" />
        </button>
      </td>
    </tr>
  );

  const renderTable = (rows) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-full">
        <thead className="sticky top-0 bg-white dark:bg-zinc-800">
          <tr>
            <th className="py-2 px-4">Intitulé</th>
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4 text-right">Dépenses</th>
            <th className="py-2 px-4 text-right">Payé par</th>
            <th />
          </tr>
        </thead>
        <tbody className="divide-y">{rows}</tbody>
      </table>
    </div>
  );

  return (
    <div className=" space-y-4">
      <Button onClick={() => router.push(`/groups/${group?._id}/expenses/new`)}>
        Ajouter une dépense
      </Button>

      {expenses.length > 0 && (
        <section className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-6 dark:bg-zinc-800">
          <div className="md:hidden divide-y">
            {sortedExpenses.slice(0, 3).map(renderMobileCard)}
          </div>
          <div className="hidden md:block">
            {renderTable(sortedExpenses.slice(0, 3).map(renderDesktopRow))}
          </div>

          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => setShowHistory(true)}
              className="bg-zinc-400 hover:bg-zinc-500 dark:bg-zinc-800 max-w-[50vh]"
            >
              Voir l'historique des dépenses
            </Button>
          </div>
        </section>
      )}

      {expenses.length === 0 && (
        <p className="text-center text-zinc-500 italic dark:text-zinc-400">
          Aucune dépense pour le moment. Ajoutez-en une !
        </p>
      )}

      {showHistory && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/70 p-4 ${
            closing
              ? "animate-[fadeOut_0.2s_ease-in]"
              : "animate-[fadeIn_0.2s_ease-out]"
          }`}
          onClick={closeHistory}
        >
          <div
            className={`bg-white dark:bg-zinc-700 w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-xl p-6 flex flex-col text-left ${
              closing
                ? "animate-[scaleOut_0.2s_ease-in]"
                : "animate-[scaleIn_0.25s_ease-out]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-2xl">Historique des dépenses</h2>
              <button
                type="button"
                onClick={closeHistory}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-2xl leading-none"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[70vh]">
              <div className="md:hidden divide-y">
                {sortedExpenses.map(renderMobileCard)}
              </div>
              <div className="hidden md:block">
                {renderTable(sortedExpenses.map(renderDesktopRow))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
