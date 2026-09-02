"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import InfoModal from "@/components/InfoModal";
import { NumericFormat } from "react-number-format";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

const EMPTY_ERRORS = {
  username: "",
  email: "",
  password: "",
  monthlyRevenues: "",
  monthlyCharges: "",
};

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [monthlyRevenues, setMonthlyRevenues] = useState("");
  const [monthlyCharges, setMonthlyCharges] = useState("");
  const [errors, setErrors] = useState({ ...EMPTY_ERRORS });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...EMPTY_ERRORS };

    if (!username) {
      newErrors.username = "Le nom d'utilisateur est obligatoire";
      valid = false;
    }

    if (!email) {
      newErrors.email = "L'email n'est pas valide";
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "L'email n'est pas valide";
        valid = false;
      }
    }

    if (!password) {
      newErrors.password = "Le mot de passe n'est pas valide";
      valid = false;
    }

    if (!monthlyRevenues) {
      newErrors.monthlyRevenues = "Les revenus mensuels ne sont pas valides";
      valid = false;
    }

    if (!monthlyCharges) {
      newErrors.monthlyCharges = "Les charges mensuelles ne sont pas valides";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch(`${NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          monthlyRevenues,
          monthlyCharges,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        const newErrors = { ...EMPTY_ERRORS };

        if (data?.field === "email") {
          newErrors.email =
            data?.msg ||
            "Cette adresse e-mail est déjà utilisée pour un autre compte. Veuillez utiliser une autre adresse e-mail.";
        } else {
          newErrors.email = data?.msg || "Une erreur est survenue";
        }

        setErrors(newErrors);
        return;
      }

      // Stocker le token
      localStorage.setItem("token", data.token);

      router.push("/groups");
    } catch {
      setErrors({
        username: "",
        email: "Une erreur est survenue, veuillez réessayer",
        password: "",
        monthlyRevenues: "",
        monthlyCharges: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        noValidate
        onSubmit={handleRegister}
        className="w-full flex flex-col gap-4"
      >
        <div>
          <label htmlFor="username">Nom d'utilisateur :</label>
          <input
            type="text"
            placeholder="JohnDoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            placeholder="contact@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            placeholder="************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="monthlyRevenues">
            Revenus mensuels nets imposables :
            <InfoModal
              label="?"
              variant="icon"
              title="Qu'est-ce que le revenu net imposable ? 💛"
            >
              C'est le{" "}
              <strong>
                montant de vos revenus retenu par l'administration fiscale
              </strong>{" "}
              pour calculer votre impôt sur le revenu, après les cotisations
              sociales, et avant l'impôt prélevé à la source. Vous pouvez
              généralement le retrouver{" "}
              <strong>
                sur votre fiche de paie ou votre avis d'imposition
              </strong>
              .
              <br />
              <br />
              <strong>Si vos revenus varient d'un mois à l'autre</strong>, pas
              d'inquiétude : vous pouvez mettre à jour votre revenu chaque mois
              depuis votre
              <strong> Espace utilisateur</strong> afin que votre contribution
              reste au plus proche de votre situation.
            </InfoModal>
          </label>
          <NumericFormat
            value={monthlyRevenues}
            decimalScale={2}
            decimalSeparator=","
            allowedDecimalSeparators={[".", ","]}
            thousandSeparator=" "
            fixedDecimalScale
            suffix=" €"
            inputMode="decimal"
            placeholder="2 228,00 €"
            allowNegative={false}
            onValueChange={(values) =>
              setMonthlyRevenues(
                values.floatValue != null ? String(values.floatValue) : "",
              )
            }
            className="appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
            name="monthlyRevenues"
          />
          {errors.monthlyRevenues && (
            <p className="text-red-500 text-sm mt-1">
              {errors.monthlyRevenues}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="monthlyCharges">
            Charges mensuelles incompressibles :
            <InfoModal
              label="?"
              variant="icon"
              title="Qu'est-ce qu'une charge fixe incompressible ? 💛"
            >
              Ce sont les{" "}
              <strong>dépenses personnelles nécessaires et régulières</strong>
              auxquelles vous êtes engagé, et que vous ne pouvez pas facilement
              réduire ou supprimer à court terme. Par exemple : le remboursement
              d'un prêt, une pension alimentaire ou certaines obligations
              financières.
              <br />
              <br />À l'inverse, les dépenses liées aux loisirs, aux envies ou
              au confort <strong>ne sont pas à prendre en compte</strong>. Les
              dépenses qui peuvent être partagées dans l'application (comme
              l'eau, l'électricité, l'abonnement internet commun ou les courses)
              n'ont pas non plus à être déclarées ici.
              <br />
              <br />
              <strong>
                En résumé : ce sont les dépenses qui pèsent réellement sur votre
                budget, indépendamment de vos choix de consommation.
              </strong>
            </InfoModal>
          </label>
          <NumericFormat
            value={monthlyCharges}
            decimalScale={2}
            decimalSeparator=","
            allowedDecimalSeparators={[".", ","]}
            thousandSeparator=" "
            fixedDecimalScale
            suffix=" €"
            inputMode="decimal"
            placeholder="800,00 €"
            allowNegative={false}
            onValueChange={(values) =>
              setMonthlyCharges(
                values.floatValue != null ? String(values.floatValue) : "",
              )
            }
            className="appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
            name="monthlyCharges"
          />
          {errors.monthlyCharges && (
            <p className="text-red-500 text-sm mt-1">{errors.monthlyCharges}</p>
          )}
        </div>

        <Button type="submit" loading={loading}>
          Créer un compte
        </Button>
      </form>

      <Button
        className="bg-zinc-400 hover:bg-zinc-500 active:bg-zinc-600 mt-10 w-70 mx-auto"
        onClick={() => router.push("/auth/login")}
      >
        Déjà un compte ?
      </Button>
    </div>
  );
}
