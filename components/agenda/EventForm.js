"use client";

import { ArrowLeftIcon, CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

import { EVENT_TYPES } from "@/utils/eventTypes";
import Button from "@/components/Button";
import FieldError from "./FieldError";
import ScheduleFields from "./ScheduleFields";
import RecurrenceFields from "./RecurrenceFields";
import ParticipantsField from "./ParticipantsField";

export default function EventForm({ form, members, heading, submitLabel, onBack }) {
  const { values, errors, loading, selectedType } = form;

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={onBack}
          title="Retour"
          className="shrink-0 cursor-pointer rounded-full bg-purple-400 hover:bg-purple-500 active:bg-purple-700 text-white size-8 flex items-center justify-center"
        >
          <ArrowLeftIcon className="size-4" />
        </button>
        <h3 className="font-semibold text-base text-zinc-800 dark:text-zinc-100">
          {heading}
        </h3>
      </div>

      <form onSubmit={form.submit} className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={values.title}
            onChange={(e) => form.changeTitle(e.target.value)}
            placeholder="Nom de l'événement..."
            className="px-4 grow p-2.5 text-sm rounded-full bg-zinc-100 dark:bg-zinc-600 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>
        <FieldError message={errors.title} />

        <div className="flex items-center gap-2">
          <input
            id="event-allday"
            type="checkbox"
            checked={values.isAllDay}
            onChange={(e) => form.toggleAllDay(e.target.checked)}
            className="size-4 accent-purple-500"
          />
          <label
            htmlFor="event-allday"
            className="text-sm text-zinc-700 dark:text-zinc-200 cursor-pointer"
          >
            Toute la journée
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="event-multiday"
            type="checkbox"
            checked={values.isMultiDay}
            onChange={(e) => form.toggleMultiDay(e.target.checked)}
            className="size-4 accent-purple-500"
          />
          <label
            htmlFor="event-multiday"
            className="text-sm text-zinc-700 dark:text-zinc-200 cursor-pointer"
          >
            Sur plusieurs jours
          </label>
        </div>
        <FieldError message={errors.schedule} />

        <ScheduleFields form={form} />

        <RecurrenceFields form={form} />

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={values.location}
            onChange={(e) => form.changeLocation(e.target.value)}
            placeholder="Lieu (optionnel)"
            className="grow min-w-0 rounded-full bg-zinc-100 dark:bg-zinc-600 px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <ParticipantsField form={form} members={members} />

        <div className="flex items-center gap-2">
          {values.type && (
            <span
              className={`size-2.5 rounded-full shrink-0 ${selectedType.dot}`}
            />
          )}
          <label htmlFor="event-type" className="sr-only">
            Type d'événement
          </label>
          <div className="relative grow min-w-0">
            <select
              id="event-type"
              value={values.type}
              onChange={(e) => form.changeType(e.target.value)}
              className="w-full appearance-none rounded-full bg-zinc-100 dark:bg-zinc-600 px-4 pr-10 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-400"
            >
              <option value="">-- Choisir la catégorie --</option>
              {EVENT_TYPES.map((eventType) => (
                <option key={eventType.id} value={eventType.id}>
                  {eventType.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 dark:text-zinc-400" />
          </div>
        </div>
        <FieldError message={errors.type} />
        <FieldError message={errors.form} />

        <Button loading={loading} className="w-full gap-2">
          <CheckIcon className="size-4" />
          {submitLabel}
        </Button>
      </form>
    </>
  );
}