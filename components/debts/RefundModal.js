"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { NumericFormat } from "react-number-format";

import Button from "@/components/Button";
import { createExpense } from "@/lib/store/slices/expenses";
import { todayInputDate } from "@/utils/dateHelpers";

export default function RefundModal({ groupId, payback, open, onClose }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.expenses.loading);

  const [amount, setAmount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && payback) {
      setAmount(payback.amount / 100);
      setError(null);
    }
  }, [open, payback]);

  const handleConfirm = async () => {
    const cents = Math.round(Number(amount) * 100);

    if (!cents || cents <= 0) {
      setError("Veuillez entrer un montant valide.");
      return;
    }

    const action = await dispatch(
      createExpense({
        groupId,
        expense: {
          kind: "refund",
          category: "💸 Remboursement",
          name: `${payback.from.name} → ${payback.to.name}`,
          amount: cents,
          paymentDate: todayInputDate(),
          credits: [{ member: payback.from._id, amount: cents }],
          debts: [{ member: payback.to._id, amount: cents }],
        },
      }),
    );

    if (createExpense.fulfilled.match(action)) {
      onClose();
    } else {
      setError(
        action.error?.message ||
          "Erreur lors de l'enregistrement du remboursement.",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 dark:bg-black/70 p-4 z-50"
    >
      <DialogBackdrop className="fixed inset-0" />
      <div className="fixed p-4 w-full flex justify-center">
        <DialogPanel className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 dark:bg-zinc-700 max-w-sm w-full">
          <h2 className="block mb-2 font-bold text-xl text-center">
            Remboursement
          </h2>

          {payback && (
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4 text-center">
              <span className="font-semibold">{payback.from.name}</span>{" "}
              rembourse <span className="font-semibold">{payback.to.name}</span>
            </p>
          )}

          <label htmlFor="refund-amount" className="block text-sm mb-1">
            Montant :
          </label>
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
            className="appearance-none w-full p-2 focus:border rounded-md bg-zinc-100 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex gap-2 mt-4">
            <Button onClick={handleConfirm} loading={loading}>
              Confirmer
            </Button>
            <Button
              className="bg-zinc-400 hover:bg-zinc-500 active:bg-zinc-600"
              onClick={onClose}
            >
              Annuler
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
