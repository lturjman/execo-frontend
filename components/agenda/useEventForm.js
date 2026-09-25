"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createAgenda, updateAgenda } from "@/lib/store/slices/agendas";
import { toDayKey } from "@/utils/eventDates";
import { getEventType } from "@/utils/eventTypes";
import { validateEventForm } from "./eventValidation";

function getInitialValues(event, dayKey, currentMember) {
  if (!event) {
    return {
      title: "",
      type: "",
      startTime: "",
      endTime: "",
      location: "",
      isAllDay: false,
      isMultiDay: false,
      startDate: dayKey,
      endDate: "",
      recurrenceFrequency: "",
      recurrenceEndDate: "",
      eventMembers: currentMember ? [currentMember._id] : [],
    };
  }

  const startDate = toDayKey(event.date) || dayKey;
  const endDate = event.endDate ? toDayKey(event.endDate) : "";
  const isMultiDay = Boolean(endDate && endDate > startDate);
  const recurrenceFrequency = event.recurrenceFrequency || "";

  return {
    title: event.title,
    type: event.type || "",
    startTime: event.startTime || "",
    endTime: event.endTime || "",
    location: event.location || "",
    isAllDay: !event.startTime && !event.endTime,
    isMultiDay,
    startDate,
    endDate: isMultiDay ? endDate : "",
    recurrenceFrequency,
    recurrenceEndDate:
      recurrenceFrequency && event.recurrenceEndDate
        ? toDayKey(event.recurrenceEndDate)
        : "",
    eventMembers:
      event.members && event.members.length ? [...event.members] : [event.member],
  };
}

export function useEventForm({ event, dayKey, currentMember, members, groupId, onSaved }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.agendas.loading);
  const [values, setValues] = useState(() =>
    getInitialValues(event, dayKey, currentMember),
  );
  const [recurrenceEndMode, setRecurrenceEndMode] = useState(() =>
    event?.recurrenceEndDate ? "date" : "never",
  );
  const [errors, setErrors] = useState({});

  function update(patch) {
    setValues((prev) => ({ ...prev, ...patch }));
  }

  function clearError(field) {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function changeTitle(title) {
    update({ title });
    clearError("title");
  }

  function toggleAllDay(isAllDay) {
    update(isAllDay ? { isAllDay, startTime: "", endTime: "" } : { isAllDay });
    clearError("endTime");
    clearError("schedule");
  }

  function toggleMultiDay(isMultiDay) {
    const baseDate = event ? toDayKey(event.date) : dayKey;
    const endDate = event?.endDate ? toDayKey(event.endDate) : baseDate;
    update({
      isMultiDay,
      startDate: baseDate,
      endDate: isMultiDay ? endDate : "",
    });
    clearError("date");
    clearError("endDate");
    clearError("schedule");
  }

  function changeStartDate(startDate) {
    setValues((prev) => ({
      ...prev,
      startDate,
      endDate: prev.endDate && startDate > prev.endDate ? startDate : prev.endDate,
      recurrenceEndDate:
        prev.recurrenceEndDate && startDate > prev.recurrenceEndDate
          ? startDate
          : prev.recurrenceEndDate,
    }));
    clearError("date");
    clearError("recurrenceEndDate");
  }

  function changeEndDate(endDate) {
    update({ endDate });
    clearError("endDate");
    clearError("date");
  }

  function changeTime(field) {
    return (value) => {
      update({ [field]: value });
      clearError("endTime");
      clearError("schedule");
    };
  }

  function changeLocation(location) {
    update({ location });
  }

  function changeType(type) {
    update({ type });
    clearError("type");
  }

  function changeRecurrenceFrequency(recurrenceFrequency) {
    update({
      recurrenceFrequency,
      recurrenceEndDate: recurrenceFrequency
        ? values.recurrenceEndDate
        : "",
    });
    if (!recurrenceFrequency) setRecurrenceEndMode("never");
    clearError("recurrenceEndDate");
  }

  function changeRecurrenceEndMode(mode) {
    setRecurrenceEndMode(mode);
    if (mode === "never") update({ recurrenceEndDate: "" });
    clearError("recurrenceEndDate");
  }

  function changeRecurrenceEndDate(recurrenceEndDate) {
    update({ recurrenceEndDate });
    clearError("recurrenceEndDate");
  }

  function toggleMember(memberId) {
    clearError("members");
    setValues((prev) => ({
      ...prev,
      eventMembers: prev.eventMembers.includes(memberId)
        ? prev.eventMembers.filter((id) => id !== memberId)
        : [...prev.eventMembers, memberId],
    }));
  }

  function toggleAllMembers(checked) {
    clearError("members");
    update({ eventMembers: checked ? members.map((member) => member._id) : [] });
  }

  function buildPayload() {
    const baseDate =
      values.startDate || (event ? toDayKey(event.date) : dayKey);
    const recurrenceFrequency = values.recurrenceFrequency || null;

    return {
      title: values.title.trim(),
      type: values.type || undefined,
      date: baseDate,
      endDate: values.isMultiDay
        ? values.endDate || baseDate
        : event
          ? null
          : undefined,
      recurrenceFrequency,
      recurrenceEndDate: recurrenceFrequency
        ? values.recurrenceEndDate || null
        : null,
      startTime: values.isAllDay ? null : values.startTime || null,
      endTime: values.isAllDay ? null : values.endTime || null,
      location: values.location.trim() || null,
      members: values.eventMembers,
    };
  }

  async function submit(e) {
    e.preventDefault();
    if (!dayKey || !currentMember) return;

    const validationErrors = validateEventForm({
      ...values,
      recurrenceEndMode,
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = buildPayload();
    const thunk = event
      ? updateAgenda({ groupId, event: { _id: event._id, ...payload } })
      : createAgenda({ groupId, event: { ...payload, member: currentMember._id } });

    const result = await dispatch(thunk);
    if (result.error) {
      setErrors({ form: "Impossible d'enregistrer l'événement. Réessayez." });
      return;
    }
    onSaved();
  }

  return {
    values,
    errors,
    loading,
    recurrenceEndMode,
    selectedType: getEventType(values.type),
    changeTitle,
    toggleAllDay,
    toggleMultiDay,
    changeStartDate,
    changeEndDate,
    changeStartTime: changeTime("startTime"),
    changeEndTime: changeTime("endTime"),
    changeLocation,
    changeType,
    changeRecurrenceFrequency,
    changeRecurrenceEndMode,
    changeRecurrenceEndDate,
    toggleMember,
    toggleAllMembers,
    submit,
  };
}