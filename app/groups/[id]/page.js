import Image from "next/image";
import Button from "app/components/Button";

export default function GroupPage() {
  return (
    <div className="p-4 space-y-6 bg-gray-200 min-h-screen">
      {/* Header du groupe */}
      <header className="w-full bg-white rounded-2xl shadow-lg overflow-hidden relative pb-6">
        <Image
          src="/images/groupImg.png"
          alt="Image de groupe"
          width={200}
          height={100}
          className="object-cover w-full h-full"
        />
        <button className="absolute top-4 left-4 rounded-full w-8 h-8 flex items-center justify-center bg-purple-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <h1 className="text-center text-xl font-semibold p-4">Nom du Groupe</h1>
        <div className=" flex justify-center">
          <Button text="Gérer les membres" />
        </div>
      </header>

      {/* Liste des dettes */}
      <section className="space-y-2">
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-6 flex justify-center space-x-2">
          <span className="font-semibold">Laura</span>
          <span>doit</span>
          <span className="font-semibold">2,38€</span>
          <span>à</span>
          <span className="font-semibold">Sherpa</span>
        </div>
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-6 flex justify-center space-x-2">
          <span className="font-semibold">Lucas</span>
          <span>doit</span>
          <span className="font-semibold">11,05€</span>
          <span>à</span>
          <span className="font-semibold">Laura</span>
        </div>
      </section>

      {/* Ajouter une dépense */}
      <section className="flex justify-center">
        <button className="w-full bg-purple-400 text-white font-semibold py-2 rounded-full">
          Ajouter une dépense
        </button>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 text-purple-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
              </td>
            </tr>
            <tr>
              <td className="py-2">22,10€</td>
              <td>Lucas</td>
              <td>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 text-purple-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
              </td>
            </tr>
            <tr>
              <td className="py-2">7,32€</td>
              <td>Sherpa</td>
              <td>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 text-purple-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
