import ProfileForm from "@/components/profile/Form";
import Logout from "@/components/profile/Logout";

export default async function ProfilePage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Mon profil</h1>
      <ProfileForm />
      <Logout />
    </div>
  );
}
