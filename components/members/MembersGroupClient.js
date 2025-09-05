"use client";

import { useSelector } from "react-redux";
import DebtsList from "@/components/debts/List";
import ExpensesList from "@/components/expenses/List";
import Button from "../Button";
import { UserPlusIcon } from "@heroicons/react/24/solid";

export default function MembersGroupClient({ groupId }) {
  const members = useSelector((state) => state.members.items);

  if (members.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 text-center">
        <p className="text-zinc-700 dark:text-zinc-200">
          Il n’y a pas encore de membre dans ce groupe.
        </p>
        <Button
          href={`/groups/${groupId}/members`}
          className="gap-2 max-w-xl mx-auto mt-6"
        >
          <UserPlusIcon className="size-5 text-white" /> Ajouter un membre
        </Button>
      </div>
    );
  }

  return (
    <>
      <DebtsList />
      <ExpensesList />
    </>
  );
}
