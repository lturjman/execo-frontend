"use client";

import Button from "@/components/Button";
import { useRouter } from "next/navigation";

import { useDispatch } from "react-redux";
import { deleteExpense } from "@/lib/store/slices/expenses";

export default function RemoveExpense({ onClose, expense, onExpenseDeleted }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDeleteExpense = async () => {
    await dispatch(deleteExpense({ groupId: expense.group, expense }));
    if (onExpenseDeleted) onExpenseDeleted();
    router.push(`/groups/${expense.group}`);
  };

  return (
    <div>
      <h2 className="block mb-2 font-bold text-xl text-center">
        Êtes vous sûr de vouloir supprimer la dépense ?
      </h2>

      <div>
        Pour rappel, cette action est irréversible et les dépenses en cours
        seront reréparties entre les autres membres du groupe
      </div>
      <div>
        <Button onClick={handleDeleteExpense} className="my-4 bg-red-400">
          Oui, Supprimer
        </Button>

        <Button className="bg-zinc-400" onClick={onClose}>
          Non, Annuler
        </Button>
      </div>
    </div>
  );
}
