import { NextPage } from "next";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Avatar from "react-avatar";

import { CgMenuRight } from "react-icons/cg";

import moment from "moment";
import { useFriendListActive } from "@/lib/store";
import LogOutButton from "../ui/LogOutButton";

interface Props {
  receiverId: string;
}

const ChatBoardHeader: NextPage<Props> = ({ receiverId }) => {
  const {
    data: user,
    isLoading,
    isFetching,
  } = useQuery<UserType>({
    queryKey: ["fetch_user"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${receiverId}`, {
        baseURL: process.env.NEXTAUTH_URL,
      });
      return data.user;
    },
    enabled: receiverId ? true : false,
  });

  const { setFriendListActive } = useFriendListActive();

  return (
    <div className="relative flex items-center gap-5 bg-white px-4 py-4">
      <div
        onClick={() => setFriendListActive()}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-zinc-200 lg:hidden"
      >
        <CgMenuRight size={20} />
      </div>
      {user?.username && (
        <div className="relative">
          <Avatar name={user.username} size="35" round={true} />
          <span
            className={`absolute -bottom-[2px] -right-[2px] inline-block h-[14px] w-[14px] rounded-full border-2 border-white shadow-lg  ${
              user.status === "online" ? "bg-green-500" : "bg-zinc-400"
            }`}
          ></span>
        </div>
      )}
      <div className="flex flex-1 justify-between">
        <div>
          <h4 className="font-semibold">
            {isLoading || isFetching ? "Loading..." : user?.username}
          </h4>
          <p className="text-xs text-zinc-500">
            {user?.status === "online"
              ? "Active now"
              : `Active ${moment(user?.updatedAt).fromNow()}`}
          </p>
        </div>
      </div>

      <LogOutButton />
    </div>
  );
};

export default ChatBoardHeader;
