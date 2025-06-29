"use client";

import Button from "@/components/Button";
import { useState, useEffect } from "react";
import { CloseButton } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function CreateExpense({ groupId, onExpenseCreated }) {
  const [expense, setExpense] = useState({
    name: "",
    amount: "",
  });
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const response = await fetch(
        `http://localhost:3000/groups/${groupId}/members`
      );
      if (!response.ok)
        throw new Error("Erreur lors du chargement des membres");
      const data = await response.json();
      setMembers(data.data);
    };

    fetchMembers();
  }, [groupId]);

  const handleCreateExpense = async () => {
    const response = await fetch(
      `http://localhost:3000/groups/${groupId}/expenses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expense }),
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la création de la dépense");
    }

    if (onExpenseCreated) onExpenseCreated();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="block font-bold text-xl"> Nouvelle dépense :</h2>
        <CloseButton as={Button} rounded={true} className="bg-gray-400">
          <XMarkIcon className="size-6" />
        </CloseButton>
      </div>
      <div>
        <label htmlFor="name"> Intitulé de la dépense</label>
        <input
          type="text"
          name="name"
          value={expense.name}
          className="w-full p-2 mb-4 rounded bg-gray-100"
          placeholder="Intitulé"
          onChange={(e) => setExpense({ ...expense, name: e.target.value })}
        />

        <label htmlFor="amount">Dépense en Euro (€)</label>
        <input
          type="number"
          name="amount"
          value={expense.amount}
          className="w-full p-2 mb-4 rounded bg-gray-100"
          placeholder="Dépense en €"
          onChange={(e) =>
            setExpense({ ...expense, amount: Number(e.target.value) })
          }
        />
        <label htmlFor="member">De :</label>
        <select
          value={expense.member}
          name="member"
          onChange={(e) => setExpense({ ...expense, member: e.target.value })}
          className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-purple-400 focus:border-purple-400 block w-full p-2"
        >
          <option value="">-- Choisir un membre --</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>

        <CloseButton as={Button} onClick={handleCreateExpense} className="my-4">
          Ajouter la dépense
        </CloseButton>
      </div>
    </div>
  );
}
