"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Avatar from "react-avatar";

import Friend from "../ui/Friend";
import FriendSkeleton from "../ui/FriendSkeleton";
import clsx from "clsx";

import { IoClose } from "react-icons/io5";
import { useFriendListActive } from "@/lib/store";

const FriendList = () => {
  const params = useParams();
  const { id } = params;
  const receiverId = id as string;

  const { data } = useSession();
  const user = data?.user as SessionType;

  const { data: users, isLoading } = useQuery<UserType[]>({
    queryKey: ["fetch_users"],
    queryFn: async () => {
      const { data } = await axios.get("/api/users");
      return data.users;
    },

    refetchInterval: 1000,
  });

  // filter all users without loggedin user
  const filteredUsers = users?.filter(
    (filterUser) => filterUser.id !== user?.id,
  );

  const { friendListActive, setFriendListActive } = useFriendListActive();

  return (
    <div
      className={clsx(
        "hiddedn 0 absolute left-0 top-0 z-[9999999] w-[280px] bg-white shadow-lg transition-transform sm:w-[400px] lg:relative lg:shadow-none",
        friendListActive
          ? "-translate-x-[110%] lg:translate-x-0"
          : "translate-x-0",
      )}
    >
      <h3 className="mb-1 flex items-center gap-3 px-4 py-3 text-2xl font-semibold text-black">
        <Avatar name={user?.username} size="35" round={true} />
        Friends List
      </h3>
      <div className="relative h-[calc(100vh-60px)]">
        {/* close button*/}
        <div
          onClick={() => setFriendListActive()}
          className="absolute right-0 flex h-10 w-10 translate-x-1/2 translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-rose-200 lg:hidden"
        >
          <IoClose size={20} />
        </div>

        <div className="flex h-full flex-col gap-3 overflow-y-scroll px-4 pb-4">
          {/* chats */}
          {isLoading
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => <FriendSkeleton key={i} />)
            : filteredUsers?.map((user) => (
                <Friend key={user.id} user={user} receiverId={receiverId} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default FriendList;
