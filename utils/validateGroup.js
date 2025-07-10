export async function validateGroup(group, setErrors) {
  const newErrors = {};
  if (!group.name || group.name.trim() === "") {
    newErrors.name = "Le nom du groupe est requis.";
  }

  if (Object.keys(newErrors).length > 0) {
    await setErrors(newErrors);
    return false;
  } else {
    return true;
  }
}
