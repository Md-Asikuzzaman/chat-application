"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NextPage } from "next";
import { LegacyRef, useEffect, useRef, useState } from "react";

interface Props {
  senderId: string;
  receiverId: string;
  scrollRef: LegacyRef<HTMLDivElement> | null;
  scrollToBottom: () => void;
}

const ChatBoard: NextPage<Props> = ({
  receiverId,
  senderId,
  scrollRef,
  scrollToBottom,
}) => {
  const [previousMessages, setPreviousMessages] = useState<MessageType[]>([]);
  const { data: messages } = useQuery<MessageType[]>({
    queryKey: ["fetch_messages"],
    queryFn: async () => {
      const { data } = await axios.get("/api/messages", {
        baseURL: process.env.NEXTAUTH_URL,
      });

      return data.messages;
    },

    refetchInterval: 1000,
  });

  useEffect(() => {
    // Compare the previousMessages with the messages fetched from the server
    if (messages && previousMessages.length > 0) {
      // Compare the lengths to check if there are new messages
      if (messages.length > previousMessages.length) {
        scrollToBottom();
      } else if (messages.length < previousMessages.length) {
        // Handle deleted messages here (if applicable)
        console.log("Some messages have been deleted");
      }
    }

    // Update previousMessages with the latest messages
    setPreviousMessages(messages || []);
  }, [messages]);

  const filteredMessage = messages?.filter(
    (message) =>
      (message.senderId === senderId && message.receiverId === receiverId) ||
      (message.receiverId === senderId && message.senderId === receiverId)
  );

  return (
    <div
      className="flex flex-col gap-3 h-[calc(100vh-230px)] overflow-y-scroll px-4"
      ref={scrollRef}
    >
      {filteredMessage?.map((data, i) => (
        <div
          key={i}
          className={`flex ${
            senderId === data.senderId ? "justify-end" : "justify-start"
          }`}
        >
          <p
            className={`inline-block py-3 px-4 rounded-xl text-white max-w-[90%] ${
              senderId === data.senderId ? "bg-violet-500" : "bg-zinc-500"
            }`}
          >
            {data.message}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatBoard;
