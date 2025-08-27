"use client";

import { useDispatch, useSelector } from "react-redux";
import { createExpense } from "@/lib/store/slices/expenses";
import { fetchMembers } from "@/lib/store/slices/members";

import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { useState, useEffect } from "react";

import { Decimal } from "decimal.js";
import ExpenseForm from "./Form";

export default function CreateExpense({ groupId, onExpenseCreated }) {
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
          debts: members.map((member) => ({
            amount: Decimal.mul(updatedExpense.amount, member.share)
              .times(100)
              .round(),
            member: member._id,
          })),
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
      router.push(`/groups/${groupId}`);
      if (onExpenseCreated) onExpenseCreated();
    }
  };

  return (
    <div className="space-y-4 ">
      <h2 className="font-bold text-xl">Nouvelle dépense :</h2>

      <ExpenseForm expense={expense} handleSubmit={handleCreateExpense} />
    </div>
  );
}
