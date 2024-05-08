import { LuMessagesSquare } from "react-icons/lu";

export default function Home() {
  return (
    <section className="grid place-content-center h-[calc(100vh-85px)]">
      <div className="flex flex-col justify-center items-center">
        <LuMessagesSquare size={110} className="text-zinc-500" />
        <h1 className="text-zinc-500 text-2xl">Let's start conversions...</h1>
      </div>
    </section>
  );
}
