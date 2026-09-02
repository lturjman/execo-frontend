export function validateExpense (expense, setErrors) {
  const newErrors = {}

  if (!expense.name || expense.name.trim() === '') {
    newErrors.name = "Veuillez entrer l'intitulé de la dépense."
  }

  if (
    expense.amount === '' ||
    expense.amount === null ||
    expense.amount === undefined ||
    Number(expense.amount) <= 0 ||
    isNaN(Number(expense.amount))
  ) {
    newErrors.amount = 'Veuillez entrer un montant valide.'
  }

  let creditsTotal = 0
  if (expense.credits) {
    creditsTotal = expense.credits.reduce(
      (sum, credit) => sum + Number(credit.amount || 0),
      0
    )
  }

  if (!expense.credits || expense.credits.length === 0) {
    newErrors.credits = 'Veuillez sélectionner au moins un payeur.'
  } else if (Math.abs(creditsTotal - Number(expense.amount)) > 0.001) {
    newErrors.credits =
      'La somme des montants payés doit correspondre au montant total de la dépense.'
  }

  if (!expense.debts || expense.debts.length === 0) {
    newErrors.debts = 'Veuillez sélectionner au moins un bénéficiaire.'
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return false
  }

  setErrors({})
  return true
}
