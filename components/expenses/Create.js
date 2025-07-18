"use client";
import { useDispatch, useSelector } from "react-redux";
import { createExpense } from "@/lib/store/slices/expenses";
import { fetchMembers } from "@/lib/store/slices/members";

import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { Decimal } from "decimal.js";
import ExpenseForm from "./Form";

export default function CreateExpense({ groupId, onExpenseCreated, onClose }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [expense, setExpense] = useState({
    name: "",
    amount: 0,
    member: "",
  });

  const members = useSelector((state) => state.members.items);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchMembers({ groupId }));
    }
  }, [dispatch, groupId]);

  const handleCreateExpense = async (updatedExpense) => {
    const action = await dispatch(
      createExpense({
        groupId,
        expense: {
          name: updatedExpense.name,
          amount: Decimal.mul(updatedExpense.amount, 100),
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
    if (createExpense.fulfilled.match(action)) {
      if (onClose) onClose();
      router.push(`/groups/${groupId}`);
      if (onExpenseCreated) onExpenseCreated();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="block font-bold text-xl"> Nouvelle dépense :</h2>
        <Button onClick={onClose} rounded={true} className="bg-gray-400">
          <XMarkIcon className="size-6" />
        </Button>
      </div>
      <ExpenseForm
        expense={expense}
        handleSubmit={handleCreateExpense}
      ></ExpenseForm>
    </div>
  );
}
