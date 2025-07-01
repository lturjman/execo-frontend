"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

import Image from "next/image";
import Button from "@/components/Button";
import CreateExpense from "@/components/CreateExpense";
import UpdateExpense from "@/components/UpdateExpense";
import {
  ArrowLeftIcon,
  PencilIcon,
  Cog8ToothIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

import GroupParameters from "@/components/GroupParameters";
import MembersList from "@/components/MembersList";
import { useState, useEffect, use } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchGroup } from "@/lib/store/slices/groups";
import { fetchExpenses } from "@/lib/store/slices/expenses";

import { amountToCurrency } from "@/utils/amountToCurrency";

export default function GroupPage({ params }) {
  const { id } = use(params);
  const dispatch = useDispatch();

  const group = useSelector((state) =>
    state.groups.items.find((g) => g && g._id === id)
  );

  const expenses = useSelector((state) => state.expenses.items);
  const expensesLoading = useSelector((state) => state.expenses.loading);

  const [expenseToEdit, setExpenseToEdit] = useState(null);

  let [groupIsOpen, setGroupIsOpen] = useState(false);
  let [memberIsOpen, setMemberIsOpen] = useState(false);
  let [expenseIsOpen, setExpenseIsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchGroup(id));
    dispatch(fetchExpenses({ groupId: id }));
  }, [dispatch, id]);

  if (!group) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-4 space-y-6 bg-gray-200 min-h-screen">
      <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden ">
        <div className="relative">
          <Image
            src="/images/groupImg.png"
            alt="Image de groupe"
            width={200}
            height={100}
            className="object-cover w-full h-full"
          />
          {/* Retour */}
          <Button href="/groups" rounded="true" className="absolute">
            <ArrowLeftIcon className="size-5 text-white" />
          </Button>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex gap-2 ">
            <h1 className="text-xl font-semibold grow">{group.name}</h1>

            {/* Member parameters */}
            <div>
              <Button rounded="true" className="">
                <UsersIcon
                  onClick={() => setMemberIsOpen(true)}
                  className="size-5 text-white"
                />
              </Button>
              <Dialog
                open={memberIsOpen}
                onClose={() => setMemberIsOpen(false)}
                transition
                className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"
              >
                <DialogBackdrop className="fixed inset-0 " />
                <div className="fixed p-4 w-full flex justify-center">
                  <DialogPanel className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-4">
                    <MembersList
                      groupId={group._id}
                      onClose={() => setMemberIsOpen(false)}
                    ></MembersList>
                  </DialogPanel>
                </div>
              </Dialog>
            </div>

            {/* Group parameters */}
            <div>
              <Button
                rounded="true"
                className=""
                onClick={() => setGroupIsOpen(true)}
              >
                <Cog8ToothIcon className="size-5 text-white" />
              </Button>
              <Dialog
                open={groupIsOpen}
                onClose={() => setGroupIsOpen(false)}
                transition
                className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"
              >
                <DialogBackdrop className="fixed inset-0" />
                <div className="fixed p-4 w-full flex justify-center">
                  <DialogPanel className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-4">
                    <GroupParameters
                      group={group}
                      onClose={() => setGroupIsOpen(false)}
                    ></GroupParameters>
                  </DialogPanel>
                </div>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des dettes */}
      <section className="space-y-2">
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-4 flex justify-center space-x-2">
          <span className="font-semibold">Laura</span>
          <span>doit</span>
          <span className="font-semibold">2,38€</span>
          <span>à</span>
          <span className="font-semibold">Sherpa</span>
        </div>
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-4 flex justify-center space-x-2">
          <span className="font-semibold">Lucas</span>
          <span>doit</span>
          <span className="font-semibold">11,05€</span>
          <span>à</span>
          <span className="font-semibold">Laura</span>
        </div>
      </section>

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
                onExpenseCreated={fetchExpenses}
              ></CreateExpense>
            </DialogPanel>
          </div>
        </Dialog>
      </div>

      {/* Tableau des dépenses */}
      <section className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-6">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 pr-4">Intitulé</th>
              <th className="py-2 pr-4">Dépenses</th>
              <th className="py-2 pr-4">Payé par</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td className="py-2">{expense.name}</td>
                <td className="py-2">{amountToCurrency(expense.amount)}</td>
                <td>{expense.credits[0].member.name}</td>
                <td>
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
                      <DialogBackdrop className="fixed inset-0 " />
                      <div className="fixed p-4 w-full flex justify-center">
                        <DialogPanel className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-4">
                          <UpdateExpense
                            expense={expense}
                            onClose={() => setExpenseToEdit(null)}
                            onExpenseUpdated={fetchExpenses}
                          ></UpdateExpense>
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
    </div>
  );
}
