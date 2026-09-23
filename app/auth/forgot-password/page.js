import AuthShell from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <AuthShell title="Mot de passe oublié">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
