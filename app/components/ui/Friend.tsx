import { NextPage } from "next";
import Link from "next/link";
import Avatar from "react-avatar";
import { FaUserCircle } from "react-icons/fa";

interface Props {
  user: UserType;
  receiverId: string;
}

const Friend: NextPage<Props> = ({ user: { id, username }, receiverId }) => {
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
        <div className="flex-1">
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
              className={`text-[15px] ${
                receiverId === id ? "text-gray-300" : "text-black"
              }`}
            >
              Hello, how are you?
            </p>
            <FaUserCircle size={15} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Friend;
