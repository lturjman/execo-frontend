"use client";

import { useRouter } from "next/navigation";
import CreateExpense from "@/components/expenses/Create";

export default function NewExpenseClient({ groupId }) {
  const router = useRouter();

  return (
    <CreateExpense
      groupId={groupId}
      onExpenseCreated={() => {
        router.push(`/groups/${groupId}`);
      }}
    />
  );
}
