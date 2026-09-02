import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export default function Register() {
  return (
    <AuthShell title="Inscription">
      <RegisterForm />
    </AuthShell>
  );
}
