import Image from "next/image";
import List from "@/components/groups/List";

export default function Home() {
  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      {/* Logo Execo */}
      <div className="mb-4">
        <Image
          src="/images/LOGO02.png"
          alt="Logo Execo"
          width={100}
          height={50}
        />
      </div>
      <List />
    </div>
  );
}
