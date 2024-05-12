import { NextPage } from "next";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Avatar from "react-avatar";

import moment from "moment";

interface Props {
  receiverId: string;
}

const ChatBoardHeader: NextPage<Props> = ({ receiverId }) => {
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
    <div className="flex items-center gap-5 py-4 relative bg-white px-4">
      {user?.username && (
        <div className="relative">
          <Avatar name={user.username} size="35" round={true} />
          <span
            className={`h-[14px] w-[14px] inline-block shadow-lg border-2 border-white rounded-full absolute -bottom-[2px] -right-[2px]  ${
              user.status === "online" ? "bg-green-500" : "bg-zinc-400"
            }`}
          ></span>
        </div>
      )}
      <div className="flex-1 flex justify-between">
        <div>
          <h4 className="font-semibold">
            {isLoading && "Loading..."}
            {user?.username}
          </h4>
          <p className="text-xs text-zinc-500">
            {user?.status === "online"
              ? "Active now"
              : `Active ${moment(user?.updatedAt).fromNow()}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBoardHeader;
