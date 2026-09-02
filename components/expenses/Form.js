"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/Button";
import ExpenseFields from "@/components/expenses/ExpenseFields";
import PayersSection from "@/components/expenses/PayersSection";
import BeneficiariesTable from "@/components/expenses/BeneficiariesTable";
import { useBeneficiaries } from "@/hooks/useBeneficiaries";
import { usePayers } from "@/hooks/usePayers";
import { fetchMembers } from "@/lib/store/slices/members";
import { computeDebtsFromPercentages } from "@/utils/expenseFormHelpers";
import { validateExpense } from "@/utils/validateExpense";

export default function ExpenseForm({
  expense,
  handleSubmit,
  submitLabel = "Valider",
}) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.expenses.loading);
  const members = useSelector((state) => state.members.items);

  const [editableExpense, setEditableExpense] = useState(() => ({
    ...expense,
  }));
  const [errors, setErrors] = useState({});

  const {
    percentages,
    checkedIds,
    checkedMembers,
    toggleBeneficiary,
    handlePercentageChange,
    handleAmountChange,
  } = useBeneficiaries(members, expense);

  const {
    payers,
    credits,
    availablePayerMembers,
    addPayer,
    removePayer,
    handleAmountChange: handlePayerAmountChange,
    handleAmountBlur,
  } = usePayers(members, expense, editableExpense.amount);

  useEffect(() => {
    if (expense?.group) {
      dispatch(fetchMembers({ groupId: expense?.group }));
    }
  }, [dispatch, expense?.group]);

  const debts = computeDebtsFromPercentages(
    percentages,
    editableExpense.amount,
    checkedMembers,
  );

  const handleAmountChangeForBeneficiary = (memberId, newAmount) =>
    handleAmountChange(memberId, newAmount, editableExpense.amount);

  const submitForm = (event) => {
    event.preventDefault();
    const isValid = validateExpense(
      { ...editableExpense, debts, credits },
      setErrors,
    );
    if (!isValid) return;
    handleSubmit({ ...editableExpense, debts, credits });
  };

  return (
    <form onSubmit={submitForm} className="flex flex-col gap-y-4">
      <ExpenseFields
        expense={editableExpense}
        onChange={setEditableExpense}
        errors={errors}
      />

      <PayersSection
        availablePayerMembers={availablePayerMembers}
        payers={payers}
        members={members}
        amount={editableExpense.amount}
        onAddPayer={addPayer}
        onRemovePayer={removePayer}
        onAmountChange={handlePayerAmountChange}
        onAmountBlur={handleAmountBlur}
        errors={errors}
      />

      <BeneficiariesTable
        members={members}
        debts={debts}
        checkedIds={checkedIds}
        percentages={percentages}
        onToggleBeneficiary={toggleBeneficiary}
        onPercentageChange={handlePercentageChange}
        onAmountChange={handleAmountChangeForBeneficiary}
        errors={errors}
      />

      <Button className="my-4" loading={loading}>
        {submitLabel}
      </Button>
    </form>
  );
}
