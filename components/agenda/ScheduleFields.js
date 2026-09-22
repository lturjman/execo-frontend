"use client";

import FieldError from "./FieldError";

const INPUT_CLASS =
  "rounded-full bg-zinc-100 dark:bg-zinc-600 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-400";

export default function ScheduleFields({ form }) {
  const { values, errors } = form;
  const { isMultiDay, isAllDay, startDate, endDate, startTime, endTime } = values;

  if (isMultiDay) {
    return (
      <>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500 dark:text-zinc-400 w-10 shrink-0">
            Début
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => form.changeStartDate(e.target.value)}
            aria-label="Date de début"
            className={`grow min-w-0 ${INPUT_CLASS}`}
          />
          {!isAllDay && (
            <input
              type="time"
              value={startTime}
              onChange={(e) => form.changeStartTime(e.target.value)}
              aria-label="Heure de début"
              className={`w-32 shrink-0 ${INPUT_CLASS}`}
            />
          )}
        </div>
        <FieldError message={errors.date} />
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500 dark:text-zinc-400 w-10 shrink-0">
            Fin
          </span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => form.changeEndDate(e.target.value)}
            aria-label="Date de fin"
            className={`grow min-w-0 ${INPUT_CLASS}`}
          />
          {!isAllDay && (
            <input
              type="time"
              value={endTime}
              onChange={(e) => form.changeEndTime(e.target.value)}
              aria-label="Heure de fin"
              className={`w-32 shrink-0 ${INPUT_CLASS}`}
            />
          )}
        </div>
        <FieldError message={errors.endDate} />
        <FieldError message={errors.endTime} />
      </>
    );
  }

  if (isAllDay) return null;

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">De :</span>
        <input
          type="time"
          value={startTime}
          onChange={(e) => form.changeStartTime(e.target.value)}
          aria-label="Heure de début"
          className={`grow min-w-0 max-w-36 ${INPUT_CLASS}`}
        />
        <span className="text-sm text-zinc-500 dark:text-zinc-400">à :</span>
        <input
          type="time"
          value={endTime}
          onChange={(e) => form.changeEndTime(e.target.value)}
          aria-label="Heure de fin"
          className={`grow min-w-0 max-w-36 ${INPUT_CLASS}`}
        />
      </div>
      <FieldError message={errors.endTime} />
    </>
  );
}