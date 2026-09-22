export function validateEventForm(values) {
  const {
    title,
    type,
    isMultiDay,
    startDate,
    endDate,
    isAllDay,
    startTime,
    endTime,
    eventMembers,
  } = values;
  const errors = {};

  if (!title.trim()) {
    errors.title = "Le titre de l'événement est requis.";
  }
  if (isMultiDay) {
    if (!startDate) {
      errors.date = "La date de début est requise.";
    }
    if (!endDate) {
      errors.endDate = "La date de fin est requise.";
    } else if (startDate && endDate < startDate) {
      errors.endDate = "La date de fin doit être après la date de début.";
    }
  }
  if (!isAllDay && startTime && endTime && endTime < startTime) {
    errors.endTime = "L'heure de fin doit être après l'heure de début.";
  }
  if (!type) {
    errors.type = "Choisissez une catégorie.";
  }
  if (!isAllDay && !isMultiDay && (!startTime || !endTime)) {
    errors.schedule = "Indiquez quand aura lieu l’événement.";
  }
  if (eventMembers.length === 0) {
    errors.members = "Sélectionnez au moins un participant.";
  }
  return errors;
}