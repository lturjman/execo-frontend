import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <AuthShell title="Connexion">
      <LoginForm />
    </AuthShell>
  );
}
