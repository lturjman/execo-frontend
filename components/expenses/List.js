"use client";

import { PencilIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
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
    state.groups.items.find((g) => g && g._id === id)
  );

  const expenses = useSelector((state) => state.expenses.items);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchExpenses({ groupId: id }));
  }, [dispatch, id]);

  return (
    <div className=" space-y-4">
      <Button onClick={() => router.push(`/groups/${group?._id}/expenses/new`)}>
        Ajouter une dépense
      </Button>

      {/* Tableau des dépenses */}
      {expenses.length > 0 && (
        <section className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-6 dark:bg-zinc-800">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2 px-4">Intitulé</th>
                <th className="py-2 px-4 text-right">Dépenses</th>
                <th className="py-2 px-4 text-right">Payé par</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {expenses
                .slice()
                .reverse()
                .map((expense) => (
                  <tr key={expense._id}>
                    <td className="p-2">{expense.name}</td>

                    <td className="p-2 text-right">
                      {amountToCurrency(expense.amount)}
                    </td>

                    <td className="p-2 text-right">
                      {expense.credits[0].member.name}
                    </td>

                    <td className="p-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/groups/${expense.group}/expenses/${expense._id}`
                          )
                        }
                      >
                        <PencilIcon className="size-5 text-purple-400" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      )}

      {expenses.length === 0 && (
        <p className="text-center text-zinc-500 italic dark:text-zinc-400">
          Aucune dépense pour le moment. Ajoutez-en une !
        </p>
      )}
    </div>
  );
}
