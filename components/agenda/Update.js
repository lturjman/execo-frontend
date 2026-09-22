"use client";

import EventForm from "./EventForm";
import { useEventForm } from "./useEventForm";

export default function Update({
  event,
  dayKey,
  groupId,
  currentMember,
  members,
  onBack,
  onSaved,
}) {
  const form = useEventForm({ event, dayKey, currentMember, members, groupId, onSaved });

  return (
    <EventForm
      form={form}
      members={members}
      heading="Modifier l'événement"
      submitLabel="Modifier l'événement"
      onBack={onBack}
    />
  );
}