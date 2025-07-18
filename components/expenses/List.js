"use client";
import CreateExpense from "@/components/expenses/Create";
import UpdateExpense from "@/components/expenses/Update";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

import { PencilIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { amountToCurrency } from "@/utils/amountToCurrency";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";

import Button from "@/components/Button";

import { fetchExpenses } from "@/lib/store/slices/expenses";

export default function expensesList() {
  const params = useParams();
  const id = params.id;

  const group = useSelector((state) =>
    state.groups.items.find((g) => g && g._id === id)
  );

  const expenses = useSelector((state) => state.expenses.items);

  const [expenseToEdit, setExpenseToEdit] = useState(null);

  let [expenseIsOpen, setExpenseIsOpen] = useState(false);

  const fetchExpensesAndPaybacks = () => {
    dispatch(fetchExpenses({ groupId: id }));
    dispatch(fetchPaybacks({ groupId: id }));
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchExpenses({ groupId: id }));
  }, [dispatch, id]);

  return (
    <div>
      <div>
        <Button className="" onClick={() => setExpenseIsOpen(true)}>
          Ajouter une dépense
        </Button>
        <Dialog
          open={expenseIsOpen}
          onClose={() => setExpenseIsOpen(false)}
          transition
          className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 " />
          <div className="fixed p-4 w-full flex justify-center">
            <DialogPanel className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-4">
              <CreateExpense
                groupId={group._id}
                onClose={() => setExpenseIsOpen(false)}
                onExpenseCreated={fetchExpensesAndPaybacks}
              ></CreateExpense>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
      ;{/* Tableau des dépenses */}
      <section className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-6">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4">Intitulé</th>
              <th className="py-2 px-4 text-right">Dépenses</th>
              <th className="py-2 px-4 text-right">Payé par</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td className="p-2">{expense.name}</td>

                <td className="p-2 text-right">
                  {amountToCurrency(expense.amount)}
                </td>

                <td className="p-2 text-right">
                  {expense.credits[0].member.name}
                </td>

                <td className="p-2">
                  <div>
                    <button onClick={() => setExpenseToEdit(expense)}>
                      <PencilIcon className="size-5 text-purple-400" />
                    </button>
                    <Dialog
                      open={expenseToEdit === expense}
                      onClose={() => setExpenseToEdit(null)}
                      transition
                      className="fixed inset-0 flex w-screen items-center bg-black/30 justify-center p-4 transition duration-300 ease-out data-closed:opacity-0"
                    >
                      <DialogBackdrop className="fixed inset-0" />
                      <div className="fixed p-4 w-full flex justify-center">
                        <DialogPanel className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-4">
                          <UpdateExpense
                            expense={expense}
                            onClose={() => setExpenseToEdit(null)}
                            onExpenseDeleted={fetchExpensesAndPaybacks}
                            onExpenseUpdated={fetchExpensesAndPaybacks}
                          />
                        </DialogPanel>
                      </div>
                    </Dialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      ;
    </div>
  );
}
