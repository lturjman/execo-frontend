export function validateExpense(expense, setErrors) {
  const newErrors = {};

  if (!expense.name || expense.name.trim() === "") {
    newErrors.name = "Veuillez entrer l'intitulé de la dépense.";
  }

  if (
    expense.amount === "" ||
    expense.amount === null ||
    expense.amount === undefined ||
    Number(expense.amount) <= 0 ||
    isNaN(Number(expense.amount))
  ) {
    newErrors.amount = "Veuillez entrer un montant valide.";
  }

  if (!expense.member) {
    newErrors.member = "Veuillez sélectionner un membre.";
  }

  if (!expense.debts || expense.debts.length === 0) {
    newErrors.debts = "Veuillez sélectionner au moins un bénéficiaire.";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return false;
  }

  setErrors({});
  return true;
}
