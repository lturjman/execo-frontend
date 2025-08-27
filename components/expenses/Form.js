"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { NumericFormat } from "react-number-format";
import { Decimal } from "decimal.js";
import { useSelector, useDispatch } from "react-redux";
import { fetchMembers } from "@/lib/store/slices/members";
import { Checkbox } from "@headlessui/react";
import { validateExpense } from "@/utils/validateExpense";

export default function ExpenseForm({
  expense,
  handleSubmit,
  submitLabel = "Valider",
}) {
  console.log("test de expense : ", expense);
  const dispatch = useDispatch();
  const [editableExpense, setEditableExpense] = useState({ ...expense });

  // useEffect(() => {
  //   if (expense) {
  //     setEditableExpense({
  //       ...expense,
  //       amount: Decimal.div(expense.amount, 100).toString(),
  //       member:
  //         (expense.credits && expense.credits[0].member?._id) || expense.member,
  //     });
  //   }
  // }, [expense]);

  const members = useSelector((state) => state.members.items);

  const [debts, setDebts] = useState(editableExpense?.debts || []);

  useEffect(() => {
    setDebts(expense?.debts || []);
  }, [expense?.debts]);

  const [errors, setErrors] = useState({});

  const toggleBeneficiary = (member) => {
    setDebts((prev) => {
      let debts;
      if (prev.some((debt) => debt.member === member)) {
        debts = prev.filter((debt) => debt.member !== member);
      } else {
        debts = [
          ...prev,
          {
            amount: 0,
            member: member,
          },
        ];
      }

      const beneficiaryShares = debts.reduce((total, debt) => {
        return total + debt.member.share;
      }, 0);

      return debts.map((debt) => {
        return {
          ...debt,
          amount: Decimal.mul(
            Decimal.div(debt.member.share, beneficiaryShares),
            editableExpense.amount
          ).toString(),
        };
      });
    });
  };

  useEffect(() => {
    if (expense?.group) {
      dispatch(fetchMembers({ groupId: expense?.group }));
    }
  }, [dispatch, expense?.group]);

  const submitForm = (event) => {
    event.preventDefault();
    const isValid = validateExpense({ ...editableExpense, debts }, setErrors);
    if (!isValid) return;
    handleSubmit({ ...editableExpense, debts });
  };

  return (
    <form onSubmit={submitForm} className="flex flex-col gap-y-4 ">
      <div>
        <label htmlFor="name">Intitulé de la dépense :</label>
        <input
          type="text"
          name="name"
          value={editableExpense?.name}
          className="appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
          placeholder="Course, Loyer, ..."
          onChange={(e) =>
            setEditableExpense({ ...editableExpense, name: e.target.value })
          }
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <label htmlFor="amount">Montant :</label>
        <NumericFormat
          value={editableExpense?.amount}
          decimalScale={2}
          decimalSeparator=","
          thousandSeparator=" "
          fixedDecimalScale
          suffix=" €"
          onValueChange={({ floatValue }) =>
            setEditableExpense({ ...editableExpense, amount: floatValue })
          }
          className="appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
          name="amount"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
        )}
      </div>
      <div>
        <label htmlFor="member">Payé par :</label>
        <select
          value={editableExpense?.member}
          name="member"
          onChange={(e) =>
            setEditableExpense({ ...editableExpense, member: e.target.value })
          }
          className="appearance-none w-full p-2 border border-zinc-300 rounded-md
             bg-white text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
        >
          <option value="">-- Choisir un membre --</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
        {errors.member && (
          <p className="text-red-500 text-sm mt-1">{errors.member}</p>
        )}
      </div>

      <h3 className="text-lg font-semibold text-zinc-800">Bénéficiaires :</h3>

      <div className="overflow-hidden rounded-md bg-white shadow-sm dark:bg-zinc-800 dark:border dark:border-zinc-500">
        <table className="w-full text-left ">
          <thead className="bg-zinc-800 text-white dark:bg-zinc-600  ">
            <tr>
              <th className="px-4 py-3 w-12 text-center"></th>
              <th className="px-4 py-3 font-semibold">Nom :</th>
              <th className="px-4 py-3 text-right font-semibold">
                Montant dû :
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const debt = debts.find((debt) => debt.member === member);
              return (
                <tr key={member._id} className={` border-t border-zinc-200`}>
                  <td className="px-4 py-3 text-center">
                    <Checkbox
                      checked={debts.some((debt) => debt.member === member)}
                      onChange={() => toggleBeneficiary(member)}
                      className="group block size-5 rounded data-checked:border-none border border-zinc-400 bg-white data-checked:bg-purple-400 p-1"
                    >
                      <svg
                        className="stroke-white opacity-0 group-data-checked:opacity-100"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Checkbox>
                  </td>
                  <td className="px-4 py-3">
                    <div>{member.name}</div>
                    {/* <div className="text-xs text-zinc-400">
                Part: {(member.share * 100).toFixed(2) + "%"}
              </div> */}
                  </td>
                  <td className="p-4 text-right">
                    <NumericFormat
                      value={debt?.amount || 0}
                      decimalScale={2}
                      decimalSeparator=","
                      thousandSeparator=" "
                      fixedDecimalScale
                      suffix=" €"
                      disabled
                      className="appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 text-right dark:bg-zinc-600 dark:text-zinc-200"
                      name="amount"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {errors.debts && <p className="text-red-500 text-sm">{errors.debts}</p>}

      <Button className="my-4">{submitLabel}</Button>
    </form>
  );
}
