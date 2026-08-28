export function validateMember (member, setErrors) {
  const newErrors = {}

  if (!member.nickname || member.nickname.trim() === '') {
    newErrors.nickname = 'Veuillez entrer le nom du membre.'
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return false
  } else {
    return true
  }
}
