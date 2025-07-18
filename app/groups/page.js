import Image from "next/image";
import List from "@/components/groups/List";

export default function Home() {
  return (
    <div
      className="min-h-screen items-center p-4 space-y-6 bg-gray-50 bg-cover bg-center bg-no-repeat "
      style={{
        backgroundImage: `url('/images/bg-5.jpg')`,
      }}
    >
      {/* Logo Execo */}
      <div className="my-4">
        <Image
          src="/images/LOGO02.png"
          alt="Logo Execo"
          className="mx-auto"
          width={100}
          height={100}
        />
      </div>
      <List />
    </div>
  );
}
