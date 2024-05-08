import { NextPage } from "next";
import { useState } from "react";

import { signOut, useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import { AiOutlineLogout } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";

interface Props {
  receiverId: string;
}

const ChatBoardHeader: NextPage<Props> = ({ receiverId }) => {
  const [menu, setMenu] = useState(false);

  const { data } = useSession();
  const loggedin = data?.user as SessionType;

  const { data: user, isLoading } = useQuery<UserType>({
    queryKey: ["fetch_user"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${receiverId}`, {
        baseURL: process.env.NEXTAUTH_URL,
      });
      return data.user;
    },
    enabled: receiverId ? true : false,
  });

  return (
    <div className="flex items-center gap-5 py-4 relative">
      <FaUserCircle size={35} />
      <div className="flex-1 flex justify-between">
        <div>
          <h4 className="font-semibold">
            {isLoading && "Loading..."}
            {user?.username}
          </h4>
          <p className="text-xs">Last Seen 2 min Ago</p>
        </div>
        <div
          onClick={(e) => {
            setMenu((prev) => !prev);
          }}
          className="h-9 w-9 bg-zinc-300 hover:bg-violet-300 transition-colors rounded-full flex items-center justify-center cursor-pointer"
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
              className="w-[230px] bg-zinc-300 absolute right-0 top-0 rounded-lg shadow-lg p-4 overflow-hidden"
            >
              <div className="flex items-center gap-3 border-b border-violet-300 pb-3 mb-3">
                <FaUserCircle size={30} />
                <div>
                  <h3>
                    {loggedin.username ? loggedin.username : "Loading..."}
                  </h3>
                </div>
              </div>

              <div
                onClick={() => {
                  signOut();
                }}
                className="flex items-center justify-between px-4 py-2 rounded-md cursor-pointer bg-rose-300 hover:bg-rose-400 transition-colors"
              >
                <p>Log out</p>
                <AiOutlineLogout size={20} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatBoardHeader;
