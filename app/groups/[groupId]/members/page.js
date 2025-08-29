import MembersList from "@/components/members/List";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Button from "@/components/Button";

export default function MembersPage({ params }) {
  const groupId = params.groupId;
  return (
    <div className="min-h-screen bg-zinc-200 dark:bg-zinc-600 p-4 flex justify-center items-start relative ">
      <Button href={`/groups/${groupId}`} rounded="true" className="absolute">
        <ArrowLeftIcon className="size-5 text-white" />
      </Button>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden p-6 mt-12">
        <MembersList groupId={groupId} />
      </div>
    </div>
  );
}
