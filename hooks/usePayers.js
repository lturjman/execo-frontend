import { useEffect, useState } from "react";
import { Decimal } from "decimal.js";
import { redistribute } from "@/utils/expenseFormHelpers";

export function usePayers(members, expense, amount) {
  const [payers, setPayers] = useState(() => []);

  const totalCents = Math.round((Number(amount) || 0) * 100);

  useEffect(() => {
    if (members.length === 0) return;
    if (Array.isArray(expense?.credits) && expense.credits.length > 0) {
      setPayers(
        expense.credits.map((credit) => ({
          memberId: credit.member?._id || credit.member,
          amount: new Decimal(credit.amount || 0).div(100).toNumber(),
        })),
      );
    } else {
      setPayers([]);
    }
  }, [members, expense]);

  useEffect(() => {
    if (payers.length > 0) {
      setPayers((prev) => redistribute(prev, totalCents));
    }
  }, [amount]);

  const payerMemberIds = payers.map((p) => p.memberId);
  const credits = payers.map((payer) => ({
    amount: String(payer.amount ?? 0),
    member: members.find((m) => m._id === payer.memberId),
  }));
  const availablePayerMembers = members.filter(
    (m) => !payerMemberIds.includes(m._id),
  );

  const addPayer = (memberId) => {
    if (!memberId || payerMemberIds.includes(memberId)) return;
    setPayers((prev) => {
      const newPayers = [...prev, { memberId, amount: 0 }];
      const base = Math.floor(totalCents / newPayers.length);
      const remainder = totalCents - base * newPayers.length;
      return newPayers.map((p, i) => ({
        ...p,
        amount: (base + (i < remainder ? 1 : 0)) / 100,
      }));
    });
  };

  const removePayer = (memberId) => {
    setPayers((prev) => {
      const removed = prev.find((p) => p.memberId === memberId);
      const others = prev.filter((p) => p.memberId !== memberId);
      if (!removed || others.length === 0) return others;
      return redistribute(others, totalCents);
    });
  };

  const redeemAmount = (prev, memberId, editedAmount) => {
    const others = prev.filter((p) => p.memberId !== memberId);
    if (others.length === 0) return prev;

    const remainingCents = totalCents - Math.round(editedAmount * 100);
    const newOthers = redistribute(others, remainingCents);
    return [...newOthers, { memberId, amount: editedAmount }];
  };

  const handleAmountChange = (memberId, value) => {
    if (value === undefined || value < 0) return;
    const editedAmount = Number(value) || 0;
    setPayers((prev) => {
      const others = prev.filter((p) => p.memberId !== memberId);
      if (others.length === 0) {
        return prev.map((p) =>
          p.memberId === memberId ? { ...p, amount: editedAmount } : p,
        );
      }
      return redeemAmount(prev, memberId, editedAmount);
    });
  };

  const handleAmountBlur = (memberId) => {
    setPayers((prev) => {
      const edited = prev.find((p) => p.memberId === memberId);
      if (!edited) return prev;
      return redeemAmount(prev, memberId, edited.amount);
    });
  };

  return {
    payers,
    credits,
    availablePayerMembers,
    addPayer,
    removePayer,
    handleAmountChange,
    handleAmountBlur,
  };
}