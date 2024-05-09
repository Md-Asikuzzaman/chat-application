import { BsThreeDots } from "react-icons/bs";
import Avatar from "react-avatar";
import { AiOutlineLogout } from "react-icons/ai";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

const LogOutButton = () => {
  const [menu, setMenu] = useState(false);

  const { data } = useSession();
  const user = data?.user as UserType;

  return (
    <>
      <div
        onClick={(e) => {
          setMenu((prev) => !prev);
        }}
        className="h-9 w-9 bg-zinc-300 hover:bg-violet-300 transition-colors rounded-full flex items-center justify-center cursor-pointer absolute top-0 right-0 translate-y-4 -translate-x-4"
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
            className="w-[230px] bg-zinc-300 absolute right-0 top-0 rounded-lg shadow-lg p-4 overflow-hidden z-50"
          >
            <div className="flex items-center gap-3 border-b border-violet-300 pb-3 mb-3">
              <Avatar name={user.username} size="30" round={true} />
              <div>
                <h3>{user.username ? user.username : "Loading..."}</h3>
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
    </>
  );
};

export default LogOutButton;
