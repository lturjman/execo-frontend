import ProfileForm from "@/components/profile/Form";
import Logout from "@/components/profile/Logout";
import Button from "@/components/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default async function ProfilePage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-zinc-200 dark:bg-zinc-600">
      <Button href={`/groups`} rounded="true" className="absolute top-4 left-4">
        <ArrowLeftIcon className="size-5 text-white" />
      </Button>

      <div className="w-full max-w-4xl bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden p-10 space-y-4">
        <h1 className="text-3xl font-bold text-center">Mon profil</h1>
        <ProfileForm />
        <Logout />
      </div>
    </div>
  );
}
