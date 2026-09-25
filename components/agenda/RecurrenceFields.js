"use client";

import { useState } from "react";
import {
  ArrowPathIcon,
  ChevronDownIcon,
  FlagIcon,
} from "@heroicons/react/24/solid";

import {
  getRecurrenceLabel,
  RECURRENCE_OPTIONS,
} from "@/utils/eventRecurrence";
import FieldError from "./FieldError";

const SELECT_CLASS =
  "w-full appearance-none rounded-full bg-zinc-100 dark:bg-zinc-600 px-4 pr-10 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50";

export default function RecurrenceFields({ form }) {
  const { values, errors } = form;
  const [isExpanded, setIsExpanded] = useState(false);
  const hasRecurrence = Boolean(values.recurrenceFrequency);
  const hasEndDateMode = form.recurrenceEndMode === "date";
  const summary = values.recurrenceFrequency
    ? getRecurrenceLabel(values.recurrenceFrequency)
    : "Ne se répète pas";

  return (
    <div className="space-y-2 pt-1">
      <button
        type="button"
        onClick={() => setIsExpanded((expanded) => !expanded)}
        aria-expanded={isExpanded}
        aria-controls="event-recurrence-fields"
        className="flex w-full cursor-pointer items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-500"
      >
        <ArrowPathIcon className="size-5 shrink-0 text-zinc-500 dark:text-zinc-400" />
        <span className="grow">
          <span className="block font-medium">Répéter</span>
          <span className="block text-xs text-zinc-500 dark:text-zinc-400">
            {summary}
          </span>
        </span>
        <ChevronDownIcon
          className={`size-4 shrink-0 text-zinc-500 transition-transform dark:text-zinc-400 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        id="event-recurrence-fields"
        className={`grid transition-[grid-template-rows,opacity] duration-200 ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="ml-7 space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <label
                htmlFor="event-recurrence"
                className="w-24 shrink-0 text-sm text-zinc-700 dark:text-zinc-200"
              >
                Fréquence
              </label>
              <div className="relative grow min-w-0">
                <select
                  id="event-recurrence"
                  value={values.recurrenceFrequency}
                  onChange={(e) =>
                    form.changeRecurrenceFrequency(e.target.value)
                  }
                  className={SELECT_CLASS}
                >
                  <option value="">Ne se répète pas</option>
                  {RECURRENCE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 dark:text-zinc-400" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="event-recurrence-end"
                className="w-24 shrink-0 text-sm text-zinc-700 dark:text-zinc-200"
              >
                Fin de la récurrence
              </label>
              <div className="relative grow min-w-0">
                <select
                  id="event-recurrence-end"
                  value={form.recurrenceEndMode}
                  onChange={(e) => form.changeRecurrenceEndMode(e.target.value)}
                  disabled={!hasRecurrence}
                  className={SELECT_CLASS}
                >
                  <option value="never">Jamais</option>
                  <option value="date">À une date</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 dark:text-zinc-400" />
              </div>
            </div>

            {hasRecurrence && hasEndDateMode && (
              <div className="flex justify-end">
                <input
                  type="date"
                  value={values.recurrenceEndDate}
                  min={values.startDate || undefined}
                  onChange={(e) => form.changeRecurrenceEndDate(e.target.value)}
                  aria-label="Date de fin de la récurrence"
                  className="rounded-full bg-zinc-100 dark:bg-zinc-600 px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <FieldError message={errors.recurrenceEndDate} />
    </div>
  );
}
