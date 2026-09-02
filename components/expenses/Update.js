"use client";

import Button from "@/components/Button";

import { useDispatch } from "react-redux";
import { updateExpense } from "../../lib/store/slices/expenses";

import { Decimal } from "decimal.js";
import ExpenseForm from "./Form";

export default function UpdateExpense({
  expense,
  onExpenseUpdated,
  onShowRemove,
}) {
  const dispatch = useDispatch();

  const handleUpdateExpense = async (updatedExpense) => {
    const action = await dispatch(
      updateExpense({
        groupId: expense.group,
        expense: {
          ...updatedExpense,
          amount: Decimal.mul(updatedExpense.amount, 100).round(),
          debts: updatedExpense.debts.map((debt) => ({
            amount: Decimal.mul(debt.amount, 100).round(),
            member: debt.member._id || debt.member,
          })),
          credits: updatedExpense.credits.map((credit) => ({
            amount: Decimal.mul(credit.amount, 100).round(),
            member: credit.member._id || credit.member,
          })),
        },
      }),
    );
    if (updateExpense.fulfilled.match(action)) {
      if (onExpenseUpdated) onExpenseUpdated();
    } else {
      alert("Erreur lors de la modification de la dépense");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="block mb-2 font-bold text-xl"> Modifier la dépense :</h2>

      <ExpenseForm
        expense={{
          ...expense,
          amount: new Decimal(expense.amount || 0).div(100).toNumber(),
        }}
        handleSubmit={handleUpdateExpense}
      />

      <hr className="my-2" />
      <label className="block mb-2 font-bold"> Supprimer la dépense :</label>
      <div>Attention, la dépense sera supprimé définitivement.</div>
      <Button
        onClick={onShowRemove}
        className="my-4 bg-red-400 hover:bg-red-500 active:bg-red-600"
      >
        Supprimer la dépense
      </Button>
    </div>
  );
}
