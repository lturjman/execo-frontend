"use client";

import { useDispatch } from "react-redux";
import { createExpense } from "@/lib/store/slices/expenses";
import { fetchMembers } from "@/lib/store/slices/members";

import { useEffect } from "react";

import { Decimal } from "decimal.js";
import ExpenseForm from "./Form";
import { todayInputDate } from "@/utils/dateHelpers";

export default function CreateExpense({ groupId, onExpenseCreated }) {
  const dispatch = useDispatch();

  const expense = {
    name: "",
    category: "",
    amount: null,
    paymentDate: todayInputDate(),
    credits: [],
  };

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
          category: updatedExpense.category,
          amount: Decimal.mul(updatedExpense.amount, 100),
          paymentDate: updatedExpense.paymentDate,
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

    if (createExpense.fulfilled.match(action)) {
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
