import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NextPage } from "next";
import Link from "next/link";
import Avatar from "react-avatar";
import { FaUserCircle } from "react-icons/fa";

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
            ? "bg-violet-600 hover:bg-violet-700"
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
          <div className="flex items-center justify-between">
            <p
              className={`text-[15px] flex-1 ${
                receiverId === id ? "text-gray-300" : "text-black"
              }`}
            >
              {getMessages ? getMessages[0]?.message : "Loading..."}
            </p>
            <FaUserCircle className="shrink-0" size={15} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Friend;
