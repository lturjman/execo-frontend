import Image from "next/image";
import Button from "@/components/Button";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/solid";

export default function GroupPage() {
  return (
    <div className="p-4 space-y-6 bg-gray-200 min-h-screen">
      <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden relative ">
        <div>
          <Image
            src="/images/groupImg.png"
            alt="Image de groupe"
            width={200}
            height={100}
            className="object-cover w-full h-full"
          />

          <Button rounded="true" className="absolute">
            <ArrowLeftIcon className="size-5 text-white" />
          </Button>
        </div>

        <div className="p-4 space-y-2">
          <h1 className="text-center text-xl font-semibold">Nom du Groupe</h1>
          <Button>Gérer les membres</Button>
        </div>
      </div>

      {/* Liste des dettes */}
      <section className="space-y-2">
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-4 flex justify-center space-x-2">
          <span className="font-semibold">Laura</span>
          <span>doit</span>
          <span className="font-semibold">2,38€</span>
          <span>à</span>
          <span className="font-semibold">Sherpa</span>
        </div>
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-4 flex justify-center space-x-2">
          <span className="font-semibold">Lucas</span>
          <span>doit</span>
          <span className="font-semibold">11,05€</span>
          <span>à</span>
          <span className="font-semibold">Laura</span>
        </div>
      </section>

      {/* Ajouter une dépense */}
      <section className="flex justify-center">
        <Button>Ajouter une dépense</Button>
      </section>

      {/* Tableau des dépenses */}
      <section className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-6">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-1">Dépenses</th>
              <th className="py-1">Membres</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="py-2">15,68€</td>
              <td>Laura</td>
              <td>
                <button>
                  <PencilIcon className="size-5 text-purple-400" />
                </button>
              </td>
            </tr>
            <tr>
              <td className="py-2">22,10€</td>
              <td>Lucas</td>
              <td>
                <button>
                  <PencilIcon className="size-5 text-purple-400" />
                </button>
              </td>
            </tr>
            <tr>
              <td className="py-2">7,32€</td>
              <td>Sherpa</td>
              <td>
                <button>
                  <PencilIcon className="size-5 text-purple-400" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
