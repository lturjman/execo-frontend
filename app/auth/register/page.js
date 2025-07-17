import Image from "next/image";
import RegisterForm from "@/components/auth/RegisterForm";

export default function Login() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6 bg-gray-50 bg-cover bg-center bg-no-repeat "
      style={{
        backgroundImage: `url('/images/bg-4.jpg')`,
      }}
    >
      <div className="mt-10">
        <Image
          src="/images/LOGO06.png"
          alt="Logo Execo"
          width={300}
          height={100}
        />
      </div>

      <h1 className="text-xl font-bold ">Inscription</h1>
      <RegisterForm />
    </main>
  );
}
