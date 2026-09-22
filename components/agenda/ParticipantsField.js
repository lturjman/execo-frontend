"use client";

import FieldError from "./FieldError";

export default function ParticipantsField({ form, members }) {
  const { values, errors } = form;

  if (members.length === 0) return null;

  return (
    <fieldset className="rounded-xl border border-zinc-200 dark:border-zinc-600 p-3 space-y-1.5">
      <legend className="text-xs text-zinc-500 dark:text-zinc-400 px-1">
        Participants
      </legend>
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 cursor-pointer">
        <input
          type="checkbox"
          checked={values.eventMembers.length === members.length}
          onChange={(e) => form.toggleAllMembers(e.target.checked)}
          className="size-4 accent-purple-500"
        />
        Tous les membres
      </label>
      {members.map((member) => (
        <label
          key={member._id}
          className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={values.eventMembers.includes(member._id)}
            onChange={() => form.toggleMember(member._id)}
            className="size-4 accent-purple-500"
          />
          {member.nickname}
        </label>
      ))}
      <FieldError message={errors.members} />
    </fieldset>
  );
}