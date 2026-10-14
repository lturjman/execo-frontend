"use client";

import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { toInputDate } from "@/utils/dateHelpers";
import {
  EXPENSE_CATEGORIES,
  CUSTOM_CATEGORY_VALUE,
  buildCustomCategory,
  isPresetCategory,
  parseCustomCategory,
} from "@/utils/expenseCategories";
import EmojiPicker from "./EmojiPicker";

function inputClass() {
  return "appearance-none w-full p-2 focus:border rounded-md bg-zinc-100 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200";
}

export default function ExpenseFields({ expense, onChange, errors }) {
  const [isCustom, setIsCustom] = useState(
    () => Boolean(expense.category) && !isPresetCategory(expense.category),
  );
  const [customDraft, setCustomDraft] = useState(() =>
    parseCustomCategory(expense.category),
  );

  const handleCategoryChange = (event) => {
    const value = event.target.value;

    if (value === CUSTOM_CATEGORY_VALUE) {
      setIsCustom(true);
      onChange({
        ...expense,
        category: buildCustomCategory(customDraft.emoji, customDraft.label),
      });
      return;
    }

    setIsCustom(false);
    onChange({ ...expense, category: value });
  };

  const updateCustomCategory = (nextDraft) => {
    setCustomDraft(nextDraft);
    onChange({
      ...expense,
      category: buildCustomCategory(nextDraft.emoji, nextDraft.label),
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <label htmlFor="category">Catégorie :</label>
          <select
            name="category"
            value={isCustom ? CUSTOM_CATEGORY_VALUE : expense.category || ""}
            className={inputClass()}
            onChange={handleCategoryChange}
          >
            <option value="" disabled>
              Choisir une catégorie
            </option>
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
            <option value={CUSTOM_CATEGORY_VALUE}>✨ Personnalisée</option>
          </select>
          {isCustom && (
            <div className="mt-2 flex items-center gap-2">
              <EmojiPicker
                value={customDraft.emoji}
                onSelect={(emoji) =>
                  updateCustomCategory({ ...customDraft, emoji })
                }
              />
              <input
                type="text"
                value={customDraft.label}
                className={inputClass()}
                placeholder="Nom de la catégorie"
                onChange={(e) =>
                  updateCustomCategory({ ...customDraft, label: e.target.value })
                }
              />
            </div>
          )}
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>
      </div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <div>
          <label htmlFor="paymentDate">Date de paiement :</label>
          <input
            type="date"
            name="paymentDate"
            value={toInputDate(expense.paymentDate)}
            className={inputClass()}
            onChange={(e) =>
              onChange({ ...expense, paymentDate: e.target.value })
            }
          />
          {errors.paymentDate && (
            <p className="text-red-500 text-sm mt-1">{errors.paymentDate}</p>
          )}
        </div>
      </div>
    </>
  );
}
