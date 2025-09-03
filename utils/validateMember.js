export function validateMember(member, setErrors) {
  const newErrors = {};

  if (!member.name || member.name.trim() === "") {
    newErrors.name = "Veuillez entrer le nom du membre.";
  }

  if (
    member.monthlyRevenue === null ||
    isNaN(member.monthlyRevenue) ||
    member.monthlyRevenue < 0
  ) {
    newErrors.monthlyRevenue = "Les revenus doivent être un nombre positif.";
  }

  if (
    member.monthlyCharges === null ||
    isNaN(member.monthlyCharges) ||
    member.monthlyCharges < 0
  ) {
    newErrors.monthlyCharges = "Les charges doivent être un nombre positif.";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return false;
  } else {
    return true;
  }
}
