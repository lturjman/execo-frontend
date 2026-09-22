"use client";

import EventForm from "./EventForm";
import { useEventForm } from "./useEventForm";

export default function Create({
  dayKey,
  groupId,
  currentMember,
  members,
  onBack,
  onSaved,
}) {
  const form = useEventForm({ dayKey, currentMember, members, groupId, onSaved });

  return (
    <EventForm
      form={form}
      members={members}
      heading="Nouvel événement"
      submitLabel="Ajouter l'événement"
      onBack={onBack}
    />
  );
}