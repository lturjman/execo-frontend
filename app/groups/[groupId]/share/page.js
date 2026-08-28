import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Button from "@/components/Button";
import GroupShare from "@/components/groups/Share";

export default async function SharePage({ params }) {
  const { groupId } = await params;

  return (
    <div className="min-h-screen bg-zinc-100  p-4 flex flex-col items-center relative">
      <Button
        href={`/groups/${groupId}`}
        rounded="true"
        className="absolute left-4 top-4"
      >
        <ArrowLeftIcon className="size-5 text-white" />
      </Button>

      <h1 className="font-bold text-3xl md:text-4xl text-center mt-20 md:mt-10">
        Partager le groupe
      </h1>

      <div className="w-full max-w-3xl bg-white  rounded-2xl shadow-lg overflow-hidden p-10 mt-10">
        <GroupShare groupId={groupId} />
      </div>
    </div>
  );
}
