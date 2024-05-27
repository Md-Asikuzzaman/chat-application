import { BsThreeDots } from "react-icons/bs";
import Avatar from "react-avatar";
import { AiOutlineLogout } from "react-icons/ai";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const LogOutButton = () => {
  const [menu, setMenu] = useState(false);

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

  const handleClick = () => {
    if (user && user?.id) {
      mutate({
        status: "offline",
        id: user.id,
      });
    }
    signOut();
  };

  return (
    <>
      <div
        onClick={(e) => {
          setMenu((prev) => !prev);
        }}
        className="absolute right-0 top-0  flex h-9 w-9 -translate-x-4 translate-y-4 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-zinc-200"
      >
        <BsThreeDots size={20} />
      </div>

      {/* dropdown */}
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{
              opacity: 0,

              y: 0,
              x: 200,
            }}
            animate={{
              opacity: 1,
              y: 60,
              x: 0,
            }}
            exit={{
              opacity: 0,

              y: 0,
              x: 200,
            }}
            transition={{
              ease: "backInOut",
            }}
            className="absolute right-4 top-0 z-50 w-[230px] overflow-hidden rounded-lg bg-[#E1D1F0] p-4 shadow-lg"
          >
            <div className="mb-3 flex items-center gap-3 border-b border-[#8318b4] pb-3">
              <Avatar name={user.username} size="30" round={true} />
              <div>
                <h3 className="text-[#8318b4]">
                  {user.username ? user.username : "Loading..."}
                </h3>
              </div>
            </div>

            <div
              onClick={handleClick}
              className="flex cursor-pointer items-center gap-3 rounded-md px-4 py-2 text-sm transition-colors hover:bg-rose-400"
            >
              <AiOutlineLogout size={20} className="text-slate-900" />
              <p className="text-slate-900">Log out</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LogOutButton;
