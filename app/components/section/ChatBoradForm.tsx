"use client";

import { NextPage } from "next";

import { BsFillSendFill } from "react-icons/bs";
import { MdEmojiEmotions } from "react-icons/md";
import { TiAttachment } from "react-icons/ti";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
  senderId: string;
  receiverId: string;
  scrollToBottom: () => void;
}

const ChatBoradForm: NextPage<Props> = ({
  senderId,
  receiverId,
  scrollToBottom,
}) => {
  const [message, setMessage] = useState<string>("");
  const queryClient = useQueryClient();

  useEffect(() => {
    scrollToBottom();
  }, [message]);

  // send message
  const { mutate } = useMutation({
    mutationKey: ["send_message"],

    mutationFn: async (newMessage: object) => {
      const { data: message } = await axios.post("/api/messages", newMessage, {
        baseURL: process.env.NEXTAUTH_URL,
      });
      return message;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch_messages"],
      });
    },

    onMutate: async (newMessage: object) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["fetch_messages"] });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(["fetch_messages"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["fetch_messages"], (old: []) => [
        ...old,
        newMessage,
      ]);

      // Return a context object with the snapshotted value
      return { previousMessages };
    },

    onError: (err, newMessage, context) => {
      queryClient.setQueryData(["todos"], context?.previousMessages);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch_messages"] });
      // scrollToBottom();
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    mutate({
      message,
      senderId,
      receiverId,
    });

    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="absolute w-full bottom-5">
      <div className="flex bg-white py-3 px-5 items-center gap-3 rounded-full">
        <TiAttachment className="shrink-0" size={30} />
        <input
          className="flex-1 py-3 outline-none outline-0"
          type="text"
          placeholder="Type a message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" hidden className="hidden">
          send
        </button>
        <MdEmojiEmotions className="shrink-0" size={22} />
        <BsFillSendFill className="shrink-0" size={22} />
      </div>
    </form>
  );
};

export default ChatBoradForm;
