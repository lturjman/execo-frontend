"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";

import Button from "@/components/Button";
import { updateExpense } from "@/lib/store/slices/expenses";

function inputClass() {
  return "appearance-none w-full p-2 focus:border rounded-md bg-zinc-100 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200";
}

export default function UpdateRefund({
  expense,
  onExpenseUpdated,
  onShowRemove,
}) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.expenses.loading);

  const from = expense.credits[0]?.member;
  const to = expense.debts[0]?.member;

  const [amount, setAmount] = useState(expense.amount / 100);
  const [error, setError] = useState(null);

  const handleUpdateRefund = async (event) => {
    event.preventDefault();

    const cents = Math.round(Number(amount) * 100);
    if (!cents || cents <= 0) {
      setError("Veuillez entrer un montant valide.");
      return;
    }

    const action = await dispatch(
      updateExpense({
        groupId: expense.group?._id || expense.group,
        expense: {
          ...expense,
          kind: "refund",
          category: "💸 Remboursement",
          amount: cents,
          credits: [{ member: from?._id || from, amount: cents }],
          debts: [{ member: to?._id || to, amount: cents }],
        },
      }),
    );

    if (updateExpense.fulfilled.match(action)) {
      if (onExpenseUpdated) onExpenseUpdated();
    } else {
      setError(
        action.error?.message ||
          "Erreur lors de la modification du remboursement.",
      );
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="block mb-2 font-bold text-xl">Modifier le remboursement :</h2>

      <form onSubmit={handleUpdateRefund} className="flex flex-col gap-y-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          <span className="font-semibold">{from?.nickname}</span> rembourse{" "}
          <span className="font-semibold">{to?.nickname}</span>
        </p>

        <div>
          <label htmlFor="refund-amount">Montant :</label>
          <NumericFormat
            id="refund-amount"
            value={amount}
            decimalScale={2}
            decimalSeparator=","
            allowedDecimalSeparators={[".", ","]}
            thousandSeparator=" "
            fixedDecimalScale
            suffix=" €"
            inputMode="decimal"
            placeholder="0,00 €"
            allowNegative={false}
            onValueChange={({ floatValue }) => setAmount(floatValue ?? "")}
            className={inputClass()}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <Button className="my-4" loading={loading}>
          Valider
        </Button>
      </form>

      <hr className="my-2" />
      <label className="block mb-2 font-bold">Supprimer le remboursement :</label>
      <div>Attention, le remboursement sera supprimé définitivement.</div>
      <Button
        onClick={onShowRemove}
        className="my-4 bg-red-400 hover:bg-red-500 active:bg-red-600"
      >
        Supprimer le remboursement
      </Button>
    </div>
  );
}
