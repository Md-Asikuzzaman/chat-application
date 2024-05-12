"use client";

import { LuMessagesSquare } from "react-icons/lu";
import LogOutButton from "../components/ui/LogOutButton";
import { useEffect, useState } from "react";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";

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

  return (
    <section className="grid place-content-center h-[calc(100vh-85px)] relative">
      <div className="flex flex-col justify-center items-center">
        <LuMessagesSquare size={110} className="text-zinc-500" />
        <h1 className="text-zinc-500 text-2xl">Let's start conversions...</h1>
      </div>

      {/* logout button */}
      <LogOutButton />
    </section>
  );
}
