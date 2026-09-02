export function validateGroup(group, setErrors) {
  const newErrors = {};
  if (!group.name || group.name.trim() === "") {
    newErrors.name = "Le nom du groupe est requis.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
}
