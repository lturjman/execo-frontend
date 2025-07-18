export function validateUser(user, setErrors) {
  const newErrors = {};

  // if (!user.username || user.username.trim() === "") {
  //   newErrors.name = "Veuillez entrer un nom d'utilisateur.";
  // }

  if (!user.email || user.email.trim() === "") {
    newErrors.email = "Veuillez entrer un email.";
  }

  if (!user.password || user.password.trim() === "") {
    newErrors.password = "Veuillez entrer un mot de passe.";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return false;
  }

  setErrors({});
  return true;
}
