"use client";

import { PencilIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { amountToCurrency } from "@/utils/amountToCurrency";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";

import Button from "@/components/Button";

import { fetchExpenses } from "@/lib/store/slices/expenses";

export default function expensesList() {
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

  const sortedExpenses = expenses.slice().reverse();

  const renderRow = (expense) => (
    <tr key={expense._id}>
      <td className="p-2">{expense.name}</td>

      <td className="p-2 text-right">{amountToCurrency(expense.amount)}</td>

      <td className="p-2 text-right">{expense.credits[0].member.nickname}</td>

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
    <table className="w-full text-left">
      <thead className="sticky top-0 bg-white dark:bg-zinc-800">
        <tr>
          <th className="py-2 px-4">Intitulé</th>
          <th className="py-2 px-4 text-right">Dépenses</th>
          <th className="py-2 px-4 text-right">Payé par</th>
          <th />
        </tr>
      </thead>
      <tbody className="divide-y">{rows}</tbody>
    </table>
  );

  return (
    <div className=" space-y-4">
      <Button onClick={() => router.push(`/groups/${group?._id}/expenses/new`)}>
        Ajouter une dépense
      </Button>

      {expenses.length > 0 && (
        <section className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-6 dark:bg-zinc-800">
          {renderTable(sortedExpenses.slice(0, 3).map(renderRow))}

          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => setShowHistory(true)}
              className={
                "bg-zinc-400 hover:bg-zinc-500 dark:bg-zinc-800 max-w-[50vh]"
              }
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
              {renderTable(sortedExpenses.map(renderRow))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
