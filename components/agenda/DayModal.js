"use client";

import { useState } from "react";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { capitalize, formatLongDate } from "./eventFormat";
import EventList from "./EventList";
import Create from "./Create";
import Update from "./Update";

export default function DayModal({
  dayKey,
  groupId,
  currentMember,
  events,
  members,
  onDelete,
  onClose,
}) {
  const [editingEvent, setEditingEvent] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  function closeForm() {
    setEditingEvent(null);
    setIsCreating(false);
  }

  return (
    <Dialog
      open
      onClose={onClose}
      className="fixed inset-0 z-40 flex w-screen items-center justify-center bg-black/30 dark:bg-black/70 p-4"
    >
      <DialogBackdrop className="fixed inset-0" />
      <div className="fixed p-4 w-full flex justify-center">
          <DialogPanel className="bg-white dark:bg-zinc-700 rounded-2xl shadow-lg overflow-hidden p-6 max-w-sm max-h-[90vh] w-full overflow-y-auto">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="font-bold text-lg capitalize">
              {capitalize(formatLongDate(dayKey))}
            </h2>
            <button
              type="button"
              onClick={onClose}
              title="Fermer"
              className="shrink-0 cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>

          {editingEvent ? (
            <Update
              event={editingEvent}
              dayKey={dayKey}
              groupId={groupId}
              currentMember={currentMember}
              members={members}
              onBack={closeForm}
              onSaved={closeForm}
            />
          ) : isCreating ? (
            <Create
              dayKey={dayKey}
              groupId={groupId}
              currentMember={currentMember}
              members={members}
              onBack={closeForm}
              onSaved={closeForm}
            />
          ) : (
            <EventList
              events={events}
              members={members}
              dayKey={dayKey}
              onCreate={() => setIsCreating(true)}
              onEdit={setEditingEvent}
              onDelete={onDelete}
            />
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}