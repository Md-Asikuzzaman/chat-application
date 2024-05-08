"use client";

import { NextPage } from "next";

import { BsFillSendFill } from "react-icons/bs";
import { MdEmojiEmotions } from "react-icons/md";
import { TiAttachment } from "react-icons/ti";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";

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

    if (message) {
      mutate({
        message,
        senderId,
        receiverId,
      });
    }

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
          required
        />
        <button type="submit" hidden className="hidden">
          send
        </button>

        <div className="h-10 w-10 bg-zinc-200 hover:bg-violet-200 transition-colors flex items-center justify-center rounded-full cursor-pointer ">
          <MdEmojiEmotions className="shrink-0 text-violet-700" size={22} />
        </div>

        {message.length > 0 && (
          <motion.div
            initial={{
              scale: 0,
              height: 0,
              width: 0,
            }}
            animate={{
              scale: 1,
              height: "40px",
              width: "40px",
            }}
            exit={{
              scale: 0,
              height: 0,
              width: 0,
            }}
            onClick={handleSubmit}
            className="h-10 w-10 bg-zinc-200 hover:bg-violet-200 transition-colors flex items-center justify-center rounded-full cursor-pointer "
          >
            <BsFillSendFill className="shrink-0 text-violet-700" size={22} />
          </motion.div>
        )}
      </div>
    </form>
  );
};

export default ChatBoradForm;
