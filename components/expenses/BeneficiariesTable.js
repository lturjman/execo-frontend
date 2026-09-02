"use client";

import { NumericFormat } from "react-number-format";
import { Checkbox } from "@headlessui/react";

export default function BeneficiariesTable({
  members,
  debts,
  checkedIds,
  percentages,
  onToggleBeneficiary,
  onPercentageChange,
  onAmountChange,
  errors,
}) {
  return (
    <>
      <h3 className="text-lg font-semibold">Bénéficiaires :</h3>

      <div className="overflow-x-auto rounded-md bg-white shadow-sm dark:bg-zinc-800 dark:border dark:border-zinc-500">
        <table className="w-full text-left">
          <thead className="bg-zinc-800 text-white dark:bg-zinc-600">
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
                <tr key={member._id} className="border-t border-zinc-200">
                  <td className="px-2 py-2 md:px-4 md:py-3 text-center">
                    <Checkbox
                      checked={isChecked}
                      onChange={() => onToggleBeneficiary(member)}
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
                          onPercentageChange(member._id, floatValue);
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
                          onAmountChange(member._id, floatValue);
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
    </>
  );
}