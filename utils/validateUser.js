export function validateUser(user, setErrors) {
  const newErrors = {};

  if (!user.username || user.username.trim() === "") {
    newErrors.username = "Veuillez entrer le nom d'utilisateur.";
  }

  if (!user.email || user.email.trim() === "") {
    newErrors.email = "Veuillez entrer l'email.";
  }

  if (
    user.monthlyRevenues === null ||
    isNaN(user.monthlyRevenues) ||
    user.monthlyRevenues < 0
  ) {
    newErrors.monthlyRevenues = "Les revenus doivent être un nombre positif.";
  }

  if (
    user.monthlyCharges === null ||
    isNaN(user.monthlyCharges) ||
    user.monthlyCharges < 0
  ) {
    newErrors.monthlyCharges = "Les charges doivent être un nombre positif.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
}
