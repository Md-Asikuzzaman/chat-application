"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { data } = useSession();
  const user = data?.user as UserType;

  const { mutate } = useMutation({
    mutationKey: ["online_status"],
    mutationFn: async ({ status, id }: { status: string; id: string }) => {
      const { data } = await axios.post(`/api/online-status/${id}`, {
        status,
      });
      return data;
    },
  });

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email !== "" && password !== "") {
      setIsLoading(true);
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      }).then(({ ok, error }: any) => {
        if (ok) {
          toast.success("Login successful!!!");
          router.push("/");
          router.refresh();
          setIsLoading(false);
        } else {
          toast.error(error);
          setIsLoading(false);
        }
      });
    }
    setEmail("");
    setPassword("");
  };

  // [Update] online status
  useEffect(() => {
    if (user && user?.id) {
      mutate({
        status: "online",
        id: user.id,
      });
    }
  }, [user]);

  return (
    <section className="bg-zinc-200 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 md:space-y-6"
              action="#"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-violet-600 block w-full p-2.5"
                  placeholder="example@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-violet-600 block w-full p-2.5"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don't have an account yet?{" "}
                <Link href={"/signup"}>
                  <span className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                    Sign up
                  </span>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
