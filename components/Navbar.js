import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Accueil</Link>
      <Link href="/auth/login">Connexion</Link>
      <Link href="/auth/register">Inscription</Link>
    </nav>
  );
}
