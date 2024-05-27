"use client";

import { LuMessagesSquare } from "react-icons/lu";
import LogOutButton from "../components/ui/LogOutButton";
import { useEffect } from "react";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { CgMenuRight } from "react-icons/cg";
import { useFriendListActive } from "@/lib/store";

export default function Home() {
  const { data } = useSession();
  const user = data?.user as SessionType;

  const { mutate } = useMutation({
    mutationKey: ["online_status"],
    mutationFn: async ({ status, id }: { status: string; id: string }) => {
      const { data } = await axios.post(`/api/online-status/${id}`, {
        status,
      });
      return data;
    },
  });

  useEffect(() => {
    // Window-close status [UPDATE]
    const handleWindowClose = () => {
      if (navigator.onLine) {
        if (user && user?.id) {
          mutate({
            status: "offline",
            id: user.id,
          });
          signOut();
        }
      }
    };

    // Online-Offline status [UPDATE]
    const handleOnlineStatusChange = () => {
      if (navigator.onLine) {
        if (user && user?.id) {
          mutate({
            status: "online",
            id: user.id,
          });
        }
      }
    };

    // Add event listeners for beforeunload and online/offline events
    window.addEventListener("beforeunload", handleWindowClose);
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  const { friendListActive, setFriendListActive } = useFriendListActive();

  return (
    <section className="relative grid h-[calc(100vh-85px)] place-content-center">
      <div className="flex flex-col items-center justify-center">
        <LuMessagesSquare size={110} className="text-zinc-500" />
        <h1 className="text-2xl text-zinc-500">Let's start conversions...</h1>
      </div>

      {/* Friend list  */}

      <div
        onClick={() => setFriendListActive()}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-zinc-200 lg:hidden"
      >
        <CgMenuRight size={20} />
      </div>

      {/* logout button */}
      <LogOutButton />
    </section>
  );
}
