"use client";

import Button from "@/components/Button";
import { useState, useEffect } from "react";
import { CloseButton } from "@headlessui/react";
import RemoveExpense from "./RemoveExpense";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function UpdateExpense({ expense, onClose, onExpenseUpdated }) {
  const [editableExpense, setEditableExpense] = useState({ ...expense });
  let [displayRemoveExpense, setDisplayRemoveExpense] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const response = await fetch(
        `http://localhost:3000/groups/${expense.group}/members`
      );
      if (!response.ok)
        throw new Error("Erreur lors du chargement des membres");
      const data = await response.json();
      setMembers(data.data);
    };

    fetchMembers();
  }, [expense.group]);

  useEffect(() => {
    if (expense) {
      setEditableExpense({ ...expense, member: expense.member._id });
    }
  }, [expense]);

  const handleUpdateExpense = async () => {
    const response = await fetch(
      `http://localhost:3000/groups/${expense.group}/expenses/${expense._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expense: editableExpense }),
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la modification de la dépense");
    }

    const data = await response.json();
    if (onExpenseUpdated) {
      onExpenseUpdated();
    }
    if (onClose) onClose();
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
          value={editableExpense.member}
          name="member"
          onChange={(e) =>
            setEditableExpense({ ...editableExpense, member: e.target.value })
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
        Supprimer le membre
      </Button>
    </div>
  );
}
