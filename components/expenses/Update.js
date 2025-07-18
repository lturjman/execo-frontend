"use client";

import Button from "@/components/Button";
import { useState } from "react";
import RemoveExpense from "./Remove";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { useDispatch, useSelector } from "react-redux";
import { updateExpense } from "../../lib/store/slices/expenses";

import { Decimal } from "decimal.js";
import ExpenseForm from "./Form";

export default function UpdateExpense({
  expense,
  onClose,
  onExpenseUpdated,
  onExpenseDeleted,
}) {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.members.items);

  let [displayRemoveExpense, setDisplayRemoveExpense] = useState(false);

  const handleUpdateExpense = async (updatedExpense) => {
    const action = await dispatch(
      updateExpense({
        groupId: expense.group,
        expense: {
          ...updatedExpense,
          amount: Decimal.mul(updatedExpense.amount, 100).round(),
          debts: members.map((member) => {
            return {
              amount: Decimal.mul(updatedExpense.amount, member.share)
                .times(100)
                .round(),
              member: member._id,
            };
          }),
          credits: [
            {
              amount: Decimal.mul(updatedExpense.amount, 100),
              member: updatedExpense.member,
            },
          ],
        },
      })
    );
    if (updateExpense.fulfilled.match(action)) {
      if (onExpenseUpdated) onExpenseUpdated();
    } else {
      alert("Erreur lors de la modification de la dépense");
    }
  };

  if (displayRemoveExpense)
    return (
      <RemoveExpense
        expense={expense}
        onClose={() => setDisplayRemoveExpense(false)}
        onExpenseDeleted={onExpenseDeleted}
      ></RemoveExpense>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="block mb-2 font-bold text-xl"> Modifier la dépense :</h2>
        <Button onClick={onClose} rounded={true} className="bg-gray-400">
          <XMarkIcon className="size-6" />
        </Button>
      </div>
      <ExpenseForm
        expense={expense}
        handleSubmit={handleUpdateExpense}
      ></ExpenseForm>

      <hr className="my-2"></hr>
      <label className="block mb-2 font-bold"> Supprimer la dépense :</label>
      <div>Attention, la dépense sera supprimé définitivement.</div>
      <Button
        onClick={() => {
          setDisplayRemoveExpense(true);
        }}
        className="my-4 bg-red-400"
      >
        Supprimer la dépense
      </Button>
    </div>
  );
}
