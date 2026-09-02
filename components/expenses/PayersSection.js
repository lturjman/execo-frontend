"use client";

import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { Listbox } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function PayersSection({
  availablePayerMembers,
  payers,
  members,
  amount,
  onAddPayer,
  onRemovePayer,
  onAmountChange,
  onAmountBlur,
  errors,
}) {
  const [selectedPayerId, setSelectedPayerId] = useState("");

  const handleAddPayer = (memberId) => {
    onAddPayer(memberId);
    setSelectedPayerId("");
  };

  return (
    <>
      <h3 className="text-lg font-semibold">Payé par :</h3>

      <div className="space-y-2">
        {availablePayerMembers.length > 0 && (
          <Listbox value={selectedPayerId} onChange={handleAddPayer}>
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
            Number(amount) > 0 && payer.amount > Number(amount);

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
                  onAmountChange(payer.memberId, floatValue);
                }}
                onBlur={() => onAmountBlur(payer.memberId)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAmountBlur(payer.memberId);
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
                onClick={() => onRemovePayer(payer.memberId)}
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
      {payers.some((p) => Number(amount) > 0 && p.amount > Number(amount)) && (
        <p className="text-red-500 text-sm">
          Le montant d&apos;un payeur ne peut pas dépasser le montant de la
          dépense.
        </p>
      )}
    </>
  );
}
