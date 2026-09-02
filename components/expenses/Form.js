"use client";

import { useEffect, useState, useRef } from "react";
import Button from "@/components/Button";
import { NumericFormat } from "react-number-format";
import { Decimal } from "decimal.js";
import { useSelector, useDispatch } from "react-redux";
import { fetchMembers } from "@/lib/store/slices/members";
import { Checkbox, Listbox } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { validateExpense } from "@/utils/validateExpense";

function rescaleTo100(pcts, ids) {
  const newPcts = { ...pcts };
  const total = ids.reduce((sum, id) => sum + (newPcts[id] || 0), 0);
  if (total > 0 && Math.abs(total - 100) > 0.01) {
    const factor = 100 / total;
    ids.forEach((id) => {
      newPcts[id] *= factor;
    });
  }
  return newPcts;
}

function rescaleOthers(newPcts, editedId, checkedIds) {
  const otherIds = checkedIds.filter((id) => id !== editedId);
  if (otherIds.length === 0) return newPcts;

  const remainder = Math.max(0, 100 - newPcts[editedId]);
  const othersTotal = otherIds.reduce((sum, id) => sum + (newPcts[id] || 0), 0);

  if (othersTotal > 0 && remainder > 0) {
    const factor = remainder / othersTotal;
    otherIds.forEach((id) => {
      newPcts[id] *= factor;
    });
  } else if (remainder > 0) {
    const equal = remainder / otherIds.length;
    otherIds.forEach((id) => {
      newPcts[id] = equal;
    });
  } else {
    otherIds.forEach((id) => {
      newPcts[id] = 0;
    });
  }

  return newPcts;
}

function computeDebtsFromPercentages(pcts, totalAmount, checkedMembers) {
  if (!totalAmount || Number(totalAmount) <= 0 || checkedMembers.length === 0) {
    return checkedMembers.map((m) => ({ amount: "0", member: m }));
  }

  const total = new Decimal(totalAmount);
  const checkedTotal = checkedMembers.reduce(
    (sum, m) => sum + (pcts[m._id] || 0),
    0,
  );

  if (checkedTotal <= 0) {
    return checkedMembers.map((m) => ({ amount: "0", member: m }));
  }

  return checkedMembers.map((member) => {
    const pct = pcts[member._id] || 0;
    const normalizedPct = new Decimal(pct).div(checkedTotal);
    const amount = total.mul(normalizedPct);
    return { amount: amount.toString(), member };
  });
}

function redistribute(others, remainingCents) {
  const weights = others.map((p) => ({
    ...p,
    weight: Math.round(p.amount * 100),
  }));
  const weightTotal = weights.reduce((sum, p) => sum + p.weight, 0);

  if (weightTotal <= 0) {
    const base = Math.floor(remainingCents / weights.length);
    const remainder = remainingCents - base * weights.length;
    return weights.map((p, i) => ({
      ...p,
      amount: (base + (i < remainder ? 1 : 0)) / 100,
    }));
  }

  const raw = weights.map((p) => p.weight * (remainingCents / weightTotal));
  let assigned = 0;

  const base = raw.map((v) => {
    const floor = Math.floor(v);
    assigned += floor;
    return { v, floor };
  });

  let rest = remainingCents - assigned;
  const sorted = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);

  for (let k = 0; k < sorted.length && rest > 0; k++, rest--) {
    base[sorted[k].i].floor += 1;
  }

  return weights.map((p, i) => ({ ...p, amount: base[i].floor / 100 }));
}

export default function ExpenseForm({
  expense,
  handleSubmit,
  submitLabel = "Valider",
}) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.expenses.loading);
  const members = useSelector((state) => state.members.items);

  const [editableExpense, setEditableExpense] = useState(() => ({
    ...expense,
  }));

  const [percentages, setPercentages] = useState({});
  const [checkedIds, setCheckedIds] = useState(() => {
    if (Array.isArray(members) && members.length > 0) {
      return members.map((m) => m._id);
    }
    return [];
  });

  const [payers, setPayers] = useState(() => []);
  const [selectedPayerId, setSelectedPayerId] = useState("");

  const [errors, setErrors] = useState({});
  const allWereUncheckedRef = useRef(false);

  useEffect(() => {
    if (expense?.group) {
      dispatch(fetchMembers({ groupId: expense?.group }));
    }
  }, [dispatch, expense?.group]);

  useEffect(() => {
    if (members.length === 0) return;

    if (Array.isArray(expense?.credits) && expense.credits.length > 0) {
      setPayers(
        expense.credits.map((credit) => ({
          memberId: credit.member?._id || credit.member,
          amount: new Decimal(credit.amount || 0).div(100).toNumber(),
        })),
      );
    } else {
      setPayers([]);
    }
  }, [members, expense]);

  useEffect(() => {
    if (payers.length > 0) {
      const totalCents = Math.round(
        (Number(editableExpense.amount) || 0) * 100,
      );
      setPayers((prev) => redistribute(prev, totalCents));
    }
  }, [editableExpense.amount]);

  useEffect(() => {
    if (members.length > 0) {
      const totalShare = members.reduce((sum, m) => sum + (m.share || 0), 0);

      const pcts = {};
      members.forEach((m) => {
        pcts[m._id] =
          totalShare > 0
            ? new Decimal(m.share || 0).div(totalShare).mul(100).toNumber()
            : 0;
      });

      setPercentages(pcts);
      setCheckedIds(members.map((m) => m._id));
    }
  }, [members, expense]);

  const checkedMembers = members.filter((m) => checkedIds.includes(m._id));
  const debts = computeDebtsFromPercentages(
    percentages,
    editableExpense.amount,
    checkedMembers,
  );

  const payerMemberIds = payers.map((p) => p.memberId);
  const credits = payers.map((payer) => ({
    amount: String(payer.amount ?? 0),
    member: members.find((m) => m._id === payer.memberId),
  }));

  const availablePayerMembers = members.filter(
    (m) => !payerMemberIds.includes(m._id),
  );

  const addPayer = (memberId) => {
    if (!memberId || payerMemberIds.includes(memberId)) return;
    setPayers((prev) => {
      const newPayers = [...prev, { memberId, amount: 0 }];
      const totalCents = Math.round(
        (Number(editableExpense.amount) || 0) * 100,
      );
      const base = Math.floor(totalCents / newPayers.length);
      const remainder = totalCents - base * newPayers.length;
      return newPayers.map((p, i) => ({
        ...p,
        amount: (base + (i < remainder ? 1 : 0)) / 100,
      }));
    });
    setSelectedPayerId("");
  };

  const removePayer = (memberId) => {
    setPayers((prev) => {
      const removed = prev.find((p) => p.memberId === memberId);
      const others = prev.filter((p) => p.memberId !== memberId);

      if (!removed || others.length === 0) {
        return others;
      }

      const totalCents = Math.round(
        (Number(editableExpense.amount) || 0) * 100,
      );

      return redistribute(others, totalCents);
    });
  };

  const handlePayerAmountChange = (memberId, value) => {
    if (value === undefined || value < 0) return;

    setPayers((prev) => {
      const others = prev.filter((p) => p.memberId !== memberId);
      const editedAmount = Number(value) || 0;

      if (others.length === 0) {
        return prev.map((p) =>
          p.memberId === memberId ? { ...p, amount: editedAmount } : p,
        );
      }

      const totalCents = Math.round(
        (Number(editableExpense.amount) || 0) * 100,
      );
      const remainingCents = totalCents - Math.round(editedAmount * 100);
      const newOthers = redistribute(others, remainingCents);

      return [...newOthers, { memberId, amount: editedAmount }];
    });
  };

  const toggleBeneficiary = (member) => {
    const isChecked = checkedIds.includes(member._id);

    if (isChecked) {
      const wasLastChecked = checkedIds.length === 1;

      setPercentages((prev) => {
        const newPcts = { ...prev };
        const removedPct = newPcts[member._id] || 0;
        newPcts[member._id] = 0;

        if (wasLastChecked) {
          members.forEach((m) => {
            newPcts[m._id] = 0;
          });
        } else {
          const remainingChecked = checkedIds.filter((id) => id !== member._id);
          const remainingTotal = remainingChecked.reduce(
            (sum, id) => sum + (prev[id] || 0),
            0,
          );

          if (remainingTotal > 0) {
            remainingChecked.forEach((id) => {
              newPcts[id] =
                (prev[id] || 0) +
                (removedPct * (prev[id] || 0)) / remainingTotal;
            });
          } else if (remainingChecked.length > 0) {
            const equal = removedPct / remainingChecked.length;
            remainingChecked.forEach((id) => {
              newPcts[id] = equal;
            });
          }
        }

        return newPcts;
      });
      setCheckedIds((prev) => {
        const newChecked = prev.filter((id) => id !== member._id);
        if (newChecked.length === 0) {
          allWereUncheckedRef.current = true;
        }
        return newChecked;
      });
    } else {
      if (allWereUncheckedRef.current) {
        allWereUncheckedRef.current = false;
        const newPcts = {};
        members.forEach((m) => {
          newPcts[m._id] = 0;
        });
        newPcts[member._id] = 100;
        setPercentages(newPcts);
      } else {
        setPercentages((prev) => {
          const newCheckedIds = [...checkedIds, member._id];
          const newPcts = { ...prev };

          newCheckedIds.forEach((id) => {
            const m = members.find((mem) => mem._id === id);
            if (m) newPcts[id] = new Decimal(m.share).mul(100).toNumber();
          });

          members.forEach((m) => {
            if (!newCheckedIds.includes(m._id)) newPcts[m._id] = 0;
          });

          return rescaleTo100(newPcts, newCheckedIds);
        });
      }
      setCheckedIds((prev) => [...prev, member._id]);
    }
  };

  const handlePercentageChange = (memberId, value) => {
    setPercentages((prev) => {
      const newPcts = { ...prev, [memberId]: value };
      return rescaleOthers(newPcts, memberId, checkedIds);
    });
  };

  const handleAmountChange = (memberId, newAmount) => {
    const totalAmount = Number(editableExpense.amount);
    if (!totalAmount || totalAmount <= 0) return;

    setPercentages((prev) => {
      const newPcts = { ...prev };
      newPcts[memberId] = (newAmount / totalAmount) * 100;
      return rescaleOthers(newPcts, memberId, checkedIds);
    });
  };

  const submitForm = (event) => {
    event.preventDefault();
    const isValid = validateExpense(
      { ...editableExpense, debts, credits },
      setErrors,
    );
    if (!isValid) return;
    handleSubmit({ ...editableExpense, debts, credits });
  };

  return (
    <form onSubmit={submitForm} className="flex flex-col gap-y-4 ">
      <div>
        <label htmlFor="name">Intitulé de la dépense :</label>
        <input
          type="text"
          name="name"
          value={editableExpense.name}
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
          allowedDecimalSeparators={[".", ","]}
          thousandSeparator=" "
          fixedDecimalScale
          suffix=" €"
          inputMode="decimal"
          placeholder="0,00 €"
          allowNegative={false}
          onValueChange={({ floatValue }) => {
            setEditableExpense({
              ...editableExpense,
              amount: floatValue ?? "",
            });
          }}
          className="appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
          name="amount"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
        )}
      </div>
      <h3 className="text-lg font-semibold">Payé par :</h3>

      <div className="space-y-2">
        {availablePayerMembers.length > 0 && (
          <Listbox
            value={selectedPayerId}
            onChange={addPayer}
          >
            <div className="relative">
              <Listbox.Button
                className="relative w-full p-2 px-4 pr-10 text-left rounded-md
                   bg-zinc-100 focus:outline-none cursor-pointer
                   focus:ring-1 focus:ring-purple-400 focus:border-purple-400
                   dark:bg-zinc-600 dark:text-zinc-200"
              >
                <span className="block truncate text-zinc-500 dark:text-zinc-300">
                  Ajouter un.e ou des payeur.se.s
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDownIcon className="size-5 text-zinc-500 dark:text-zinc-300" />
                </span>
              </Listbox.Button>
              <Listbox.Options
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md
                   border border-zinc-200 bg-white py-1 shadow-lg
                   dark:border-zinc-600 dark:bg-zinc-800"
              >
                {availablePayerMembers.map((member) => (
                  <Listbox.Option
                    key={member._id}
                    value={member._id}
                    className="cursor-pointer select-none py-2 pl-3 pr-9 text-sm
                       text-zinc-800 data-[focus]:bg-purple-100 data-[focus]:text-purple-900
                       dark:text-zinc-200 dark:data-[focus]:bg-purple-900 dark:data-[focus]:text-purple-100"
                  >
                    {member.nickname}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        )}

        {payers.map((payer) => {
          const member = members.find((m) => m._id === payer.memberId);
          const exceedsTotal =
            Number(editableExpense.amount) > 0 &&
            payer.amount > Number(editableExpense.amount);

          return (
            <div
              key={payer.memberId}
              className="flex items-center gap-2 rounded-md bg-white shadow-sm dark:bg-zinc-800 dark:border dark:border-zinc-500 p-2"
            >
              <span className="min-w-0 flex-1 text-zinc-800 dark:text-zinc-200">
                {member?.nickname || ""}
              </span>
              <NumericFormat
                value={payer.amount}
                decimalScale={2}
                decimalSeparator=","
                thousandSeparator=" "
                fixedDecimalScale
                suffix=" €"
                allowNegative={false}
                onValueChange={({ floatValue }) => {
                  setPayers((prev) =>
                    prev.map((p) =>
                      p.memberId === payer.memberId
                        ? { ...p, amount: Number(floatValue) || 0 }
                        : p,
                    ),
                  );
                }}
                onBlur={() => {
                  setPayers((prev) => {
                    const edited = prev.find(
                      (p) => p.memberId === payer.memberId,
                    );
                    if (!edited) return prev;

                    const others = prev.filter(
                      (p) => p.memberId !== payer.memberId,
                    );
                    if (others.length === 0) return prev;

                    const totalCents = Math.round(
                      (Number(editableExpense.amount) || 0) * 100,
                    );
                    const remainingCents =
                      totalCents - Math.round(edited.amount * 100);
                    const newOthers = redistribute(others, remainingCents);

                    return [...newOthers, edited];
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setPayers((prev) => {
                      const edited = prev.find(
                        (p) => p.memberId === payer.memberId,
                      );
                      if (!edited) return prev;

                      const others = prev.filter(
                        (p) => p.memberId !== payer.memberId,
                      );
                      if (others.length === 0) return prev;

                      const totalCents = Math.round(
                        (Number(editableExpense.amount) || 0) * 100,
                      );
                      const remainingCents =
                        totalCents - Math.round(edited.amount * 100);
                      const newOthers = redistribute(others, remainingCents);

                      return [...newOthers, edited];
                    });
                  }
                }}
                className={`w-32 p-1 text-right rounded-md border
                   bg-white text-zinc-800 focus:outline-none
                   focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200 ${
                     exceedsTotal
                       ? "border-red-500 focus:ring-red-400 focus:border-red-400"
                       : "border-zinc-300"
                   }`}
                name="amount"
              />
              <button
                type="button"
                onClick={() => removePayer(payer.memberId)}
                className="text-zinc-400 hover:text-red-500"
                aria-label="Supprimer le payeur"
              >
                <TrashIcon className="size-5" />
              </button>
            </div>
          );
        })}
      </div>
      {errors.credits && (
        <p className="text-red-500 text-sm">{errors.credits}</p>
      )}
      {payers.some(
        (p) =>
          Number(editableExpense.amount) > 0 &&
          p.amount > Number(editableExpense.amount),
      ) && (
        <p className="text-red-500 text-sm">
          Le montant d'un payeur ne peut pas dépasser le montant de la dépense.
        </p>
      )}

      <h3 className="text-lg font-semibold">Bénéficiaires :</h3>

      <div className="overflow-x-auto rounded-md bg-white shadow-sm dark:bg-zinc-800 dark:border dark:border-zinc-500">
        <table className="w-full text-left ">
          <thead className="bg-zinc-800 text-white dark:bg-zinc-600  ">
            <tr>
              <th className="p-2 w-10 text-center" />
              <th className="p-2 text-center md:text-left font-semibold">
                Nom
              </th>
              <th className="p-2 w-20 text-center font-semibold">Taux</th>
              <th className="p-2 w-[40%] text-center md:text-right font-semibold">
                Montant dû
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const debt = debts.find(
                (d) => (d.member._id || d.member) === member._id,
              );
              const isChecked = checkedIds.includes(member._id);
              const pct = percentages[member._id] ?? 0;

              return (
                <tr key={member._id} className=" border-t border-zinc-200">
                  <td className="px-2 py-2 md:px-4 md:py-3 text-center">
                    <Checkbox
                      checked={isChecked}
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
                  <td className="px-2 py-2 md:px-4 md:py-3">
                    <div>{member.nickname}</div>
                  </td>
                  <td className="px-2 py-2 md:px-4 md:py-3 text-center">
                    <NumericFormat
                      value={pct}
                      decimalScale={2}
                      decimalSeparator=","
                      suffix=" %"
                      allowNegative={false}
                      onValueChange={({ floatValue }) => {
                        if (floatValue !== undefined && floatValue >= 0) {
                          handlePercentageChange(member._id, floatValue);
                        }
                      }}
                      className="w-20 md:w-24 p-1 text-center rounded-md border border-zinc-300
                         bg-white text-zinc-800 focus:outline-none
                         focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
                    />
                  </td>
                  <td className="px-2 py-2 md:px-4 md:py-3 text-right">
                    <NumericFormat
                      value={debt?.amount || "0"}
                      decimalScale={2}
                      decimalSeparator=","
                      thousandSeparator=" "
                      fixedDecimalScale
                      suffix=" €"
                      disabled={!isChecked}
                      onValueChange={({ floatValue }) => {
                        if (
                          floatValue !== undefined &&
                          floatValue >= 0 &&
                          isChecked
                        ) {
                          handleAmountChange(member._id, floatValue);
                        }
                      }}
                      className="w-full p-1 text-right rounded-md border border-zinc-300
                         bg-white text-zinc-800 focus:outline-none
                         focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
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

      <Button className="my-4" loading={loading}>
        {submitLabel}
      </Button>
    </form>
  );
}
