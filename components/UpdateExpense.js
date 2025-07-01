"use client";

import Button from "@/components/Button";
import { useState, useEffect } from "react";
import { CloseButton } from "@headlessui/react";
import RemoveExpense from "./RemoveExpense";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { useDispatch, useSelector } from "react-redux";
import { updateExpense } from "../lib/store/slices/expenses";
import { fetchMembers } from "../lib/store/slices/members";
import { fetchExpenses } from "../lib/store/slices/expenses";

export default function UpdateExpense({ expense, onClose, onExpenseUpdated }) {
  const dispatch = useDispatch();

  const [editableExpense, setEditableExpense] = useState({ ...expense });
  let [displayRemoveExpense, setDisplayRemoveExpense] = useState(false);
  const members = useSelector((state) => state.members.items);

  useEffect(() => {
    if (expense.group) {
      dispatch(fetchMembers({ groupId: expense.group }));
    }
  }, [dispatch, expense.group]);

  useEffect(() => {
    if (expense) {
      setEditableExpense({
        ...expense,
        member: expense.credits[0].member?._id || expense.member,
      });
    }
  }, [expense]);

  const handleUpdateExpense = async () => {
    const action = await dispatch(
      updateExpense({ groupId: expense.group, expense: editableExpense })
    );
    if (updateExpense.fulfilled.match(action)) {
      await dispatch(fetchExpenses({ groupId: expense.group }));
      if (onExpenseUpdated) onExpenseUpdated();
      if (onClose) onClose();
    } else {
      alert("Erreur lors de la modification de la dépense");
    }
  };

  if (displayRemoveExpense)
    return (
      <RemoveExpense
        expense={expense}
        onClose={() => setDisplayRemoveExpense(false)}
      ></RemoveExpense>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="block mb-2 font-bold text-xl"> Modifier la dépense :</h2>
        <CloseButton as={Button} rounded={true} className="bg-gray-400">
          <XMarkIcon className="size-6" />
        </CloseButton>
      </div>
      <div>
        <label htmlFor="name"> Intitulé de la dépense</label>
        <input
          type="text"
          value={editableExpense.name}
          className="w-full p-2 mb-4 rounded bg-gray-100"
          name="name"
          placeholder="Intitulé"
          onChange={(e) =>
            setEditableExpense({ ...editableExpense, name: e.target.value })
          }
        />
        <label htmlFor="amount">Dépense en Euro (€)</label>
        <input
          type="number"
          value={editableExpense.amount}
          className="w-full p-2 mb-4 rounded bg-gray-100"
          name="amount"
          placeholder="Dépense en €"
          onChange={(e) =>
            setEditableExpense({
              ...editableExpense,
              amount: Number(e.target.value),
            })
          }
        />

        <label htmlFor="member">De :</label>
        <select
          value={editableExpense.credits[0].member._id}
          name="member"
          onChange={(e) =>
            setEditableExpense({
              ...editableExpense,
              credits: [
                { ...editableExpense.credits[0], member: e.target.value },
              ],
            })
          }
          className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-purple-400 focus:border-purple-400 block w-full p-2"
        >
          <option value="">-- Choisir un membre --</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>

        <CloseButton as={Button} className="my-4" onClick={handleUpdateExpense}>
          Valider les modifications
        </CloseButton>
      </div>
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
