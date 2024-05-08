"use client";

import React from "react";
import ChatUser from "../ui/ChatUser";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

interface QueryType {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UType {
  email: string;
  id: string;
}

const ChatList = () => {
  const params = useParams();
  const { id } = params;
  const receiverId = id as string;

  const { data } = useSession();
  const user = data?.user as UType;

  const { data: users, isLoading } = useQuery<QueryType[]>({
    queryKey: ["fetch_users"],
    queryFn: async () => {
      const { data } = await axios.get("/api/users");
      return data.users;
    },
  });

  // filter all users without loggedin user
  const filteredUsers = users?.filter(
    (filterUser) => filterUser.id !== user?.id
  );

  return (
    <div className="w-[275px] sm:w-[300px] md:w-[375px] lg:w-[475px] bg-slate-300">
      <h3 className="text-2xl text-black font-semibold mb-1 px-4 py-3">
        Chat Lists
      </h3>
      <div className="h-[calc(100vh-100px)]">
        <div className="flex flex-col gap-3 overflow-y-scroll h-full px-4 pb-4">
          {/* chats */}
          {isLoading && "Loading..."}
          {filteredUsers?.map((user) => (
            <ChatUser key={user.id} user={user} receiverId={receiverId} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
