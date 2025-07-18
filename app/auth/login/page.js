import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function Login() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6 bg-gray-50 bg-cover bg-center bg-no-repeat "
      style={{
        backgroundImage: `url('/images/bg-5.jpg')`,
      }}
    >
      <div className="mt-10">
        <Link href="/">
          <Image
            src="/images/LOGO06.png"
            alt="Logo Execo"
            width={300}
            height={100}
          />
        </Link>
      </div>

      <h1 className="text-xl font-bold text-white">Connexion</h1>
      <LoginForm />
    </main>
  );
}
