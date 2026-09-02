"use client";

import { NumericFormat } from "react-number-format";

function inputClass() {
  return "appearance-none w-full p-2 focus:border rounded-md bg-zinc-100 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200";
}

export default function ExpenseFields({ expense, onChange, errors }) {
  return (
    <>
      <div>
        <label htmlFor="name">Intitulé de la dépense :</label>
        <input
          type="text"
          name="name"
          value={expense.name}
          className={inputClass()}
          placeholder="Course, Loyer, ..."
          onChange={(e) => onChange({ ...expense, name: e.target.value })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="amount">Montant :</label>
        <NumericFormat
          value={expense?.amount}
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
            onChange({ ...expense, amount: floatValue ?? "" });
          }}
          className={inputClass()}
          name="amount"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
        )}
      </div>
    </>
  );
}
