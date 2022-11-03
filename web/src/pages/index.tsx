interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

import Image from "next/image";
import appPreviewImage from "../assets/app-nlw-copa-preview.png";
import logoImage from "../assets/logo.svg";
import usersAvatarExampleImg from "../assets/users-avatar-example.png";
import iconCheckImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function createPool(event: FormEvent) {
    event.preventDefault();
    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      setPoolTitle('')
      alert(
        "Bolão criado com sucesso, o codigo foi criado para a area de transferencia"
      );
    } catch (error) {
      alert("Falha ao criar o bolão");
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImage} alt="NLW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" />

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="text-gray-100 flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm"
            type="text"
            required
            placeholder="Qual o nome do seu bolão?"
            value={poolTitle}
            onChange={(e) => setPoolTitle(e.target.value)}
          />

          <button
            className="hover:bg-yellow-700 bg-yellow-500 px-6 py-4 rounded font-bold text-gray-900 text-sm uppercase"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-14 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />

            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões Criados</span>
            </div>
          </div>

          <div className="w-px h-10 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />

            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites Enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image src={appPreviewImage} alt="dois celulares" quality={100} />
    </div>
  );
}

export const getStaticProps = async () => {
  const [poolCountRes, guessCountRes, userCountRes] = await Promise.all([
    api.get("pools/count"),
    api.get("guesses/count"),
    api.get("users/count"),
  ]);

  return {
    props: {
      poolCount: poolCountRes.data.count,
      guessCount: guessCountRes.data.count,
      userCount: userCountRes.data.count,
    },
  };
};
