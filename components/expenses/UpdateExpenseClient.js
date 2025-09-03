"use client";

import { useRouter, useParams } from "next/navigation";
import UpdateExpense from "@/components/expenses/Update";
import { useSelector } from "react-redux";
import { useState } from "react";
import RemoveExpense from "@/components/expenses/Remove";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";

export default function UpdateExpenseClient({ groupId }) {
  const router = useRouter();
  const params = useParams();
  const expenseId = params.expenseId;

  const expense = useSelector((state) =>
    state.expenses.items.find((e) => e._id === expenseId)
  );

  const [showRemoveModal, setShowRemoveModal] = useState(false);

  return (
    <>
      <UpdateExpense
        expense={expense}
        groupId={groupId}
        onExpenseUpdated={() => {
          router.push(`/groups/${groupId}`);
        }}
        onShowRemove={() => setShowRemoveModal(true)}
      />
      <Dialog
        open={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 dark:bg-black/70 p-4 z-50"
      >
        <DialogBackdrop className="fixed inset-0" />
        <div className="fixed p-4 w-full flex justify-center max-w-3xl">
          <DialogPanel className="bg-white rounded-2xl shadow-lg overflow-hidden p-4 dark:bg-zinc-700">
            <RemoveExpense
              expense={expense}
              onClose={() => setShowRemoveModal(false)}
              onExpenseDeleted={() => router.push(`/groups/${groupId}`)}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
