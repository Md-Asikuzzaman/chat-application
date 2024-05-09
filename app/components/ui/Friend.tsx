import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NextPage } from "next";
import Link from "next/link";
import Avatar from "react-avatar";
import { FaUserCircle } from "react-icons/fa";
import { MdMarkChatUnread } from "react-icons/md";

interface Props {
  user: UserType;
  receiverId: string;
}

const Friend: NextPage<Props> = ({ user: { id, username }, receiverId }) => {
  const { data: getMessages } = useQuery<MessageType[]>({
    queryKey: ["getMessage", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/messages/${id}`, {
        baseURL: process.env.NEXTAUTH_URL,
      });

      return data.messages;
    },

    refetchInterval: 1000,
  });

  return (
    <Link href={`/chat/${id}`}>
      <div
        className={`p-4 rounded-xl flex justify-between items-center gap-4 ${
          receiverId === id
            ? "bg-violet-500 hover:bg-violet-600"
            : "bg-white hover:bg-gray-100"
        }`}
      >
        <div>
          <Avatar name={username} size="35" round={true} />
        </div>
        <div className="flex-1 truncate">
          <div className="flex items-center justify-between">
            <h4
              className={`font-semibold ${
                receiverId === id ? "text-white " : "text-black"
              }`}
            >
              {username}
            </h4>
            <span
              className={`text-xs ${
                receiverId === id ? "text-gray-300" : "text-black"
              }`}
            >
              3:00 PM
            </span>
          </div>
          <div className="flex items-center gap-2">
            {getMessages && getMessages[0]?.status === 0 && (
              <MdMarkChatUnread
                className="shrink-0 text-violet-600"
                size={15}
              />
            )}
            <p
              className={`text-[15px] flex-1 ${
                receiverId === id ? "text-zinc-200" : "text-zinc-400"
              } ${
                getMessages &&
                getMessages[0]?.status === 0 &&
                "font-semibold text-violet-600"
              }`}
            >
              {getMessages && getMessages.length >= 1
                ? getMessages
                  ? getMessages[0]?.message
                  : "Loading..."
                : "no message"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Friend;
