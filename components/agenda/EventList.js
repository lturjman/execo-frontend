"use client";

import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";

import { getEventType } from "@/utils/eventTypes";
import { eventCoversDayKey } from "@/utils/eventDates";
import Button from "@/components/Button";
import {
  formatEventRange,
  formatEventTime,
  formatRecurrence,
} from "./eventFormat";

function getParticipants(event, members) {
  const ids =
    event.members && event.members.length ? event.members : [event.member];
  return [
    ...new Set(
      ids.map((id) => members.find((member) => member._id === id)).filter(Boolean),
    ),
  ];
}

export default function EventList({ events, members, dayKey, onCreate, onEdit, onDelete }) {
  const dayEvents = events.filter((event) => eventCoversDayKey(event, dayKey));

  return (
    <>
      {dayEvents.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 italic mb-4">
          Aucun événement ce jour.
        </p>
      ) : (
        <ul className="space-y-2 mb-4 max-h-56 overflow-y-auto">
          {dayEvents.map((event) => {
            const eventType = getEventType(event.type);
            const participants = getParticipants(event, members);
            const range = formatEventRange(event);
            const recurrence = formatRecurrence(event);
            return (
              <li
                key={event._id}
                className={`flex items-start gap-2 rounded-lg border px-3 py-2 ${eventType.card}`}
              >
                <span
                  className={`size-2.5 rounded-full shrink-0 mt-1.5 ${eventType.dot}`}
                />
                <div className="grow min-w-0">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    {event.title}
                  </p>
                  <ul className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 space-y-0.5">
                    {range && <li>{range}</li>}
                    <li>
                      {event.startTime || event.endTime
                        ? formatEventTime(event)
                        : "Toute la journée"}
                    </li>
                    {event.location && <li>{event.location}</li>}
                    {recurrence && <li>{recurrence}</li>}
                    {participants.length > 0 && (
                      <li className="flex flex-wrap gap-1 pt-0.5">
                        {participants.map((member) => (
                          <span
                            key={member._id}
                            className="rounded-full bg-white/70 dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-600 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:text-zinc-200"
                          >
                            {member.nickname}
                          </span>
                        ))}
                      </li>
                    )}
                  </ul>
                </div>
                <span
                  className={`shrink-0 text-[11px] font-medium rounded-full px-2 py-0.5 ${eventType.chip}`}
                >
                  {eventType.label}
                </span>
                <span className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(event)}
                    title="Modifier"
                    className="cursor-pointer p-2 -m-2 text-zinc-400 hover:text-purple-500"
                  >
                    <PencilIcon className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(event)}
                    title="Supprimer"
                    className="cursor-pointer p-2 -m-2 text-zinc-400 hover:text-red-500"
                  >
                    <TrashIcon className="size-5" />
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <Button onClick={onCreate} className="w-full gap-2">
        <PlusIcon className="size-4" />
        Ajouter un événement
      </Button>
    </>
  );
}