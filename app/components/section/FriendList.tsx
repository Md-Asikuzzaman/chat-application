"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Avatar from "react-avatar";

import Friend from "../ui/Friend";
import FriendSkeleton from "../ui/FriendSkeleton";

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

  return (
    <div className="min-w-[360px] bg-slate-300 lg:min-w-[400px]">
      <h3 className="mb-1 flex items-center gap-3 px-4 py-3 text-2xl font-semibold text-black">
        <Avatar name={user?.username} size="35" round={true} />
        Friends List
      </h3>
      <div className="h-[calc(100vh-70px)]">
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
