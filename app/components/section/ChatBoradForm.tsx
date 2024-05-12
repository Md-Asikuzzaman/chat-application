"use client";

import { NextPage } from "next";

import { BsFillSendFill } from "react-icons/bs";
import { MdClose, MdEmojiEmotions } from "react-icons/md";
import { TiAttachment } from "react-icons/ti";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import EmojiPlate from "../ui/EmojiPlate";

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
  const [emojiPlate, setEmojiPlate] = useState<boolean>(false);
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

      console.log("ok");
    },

    onMutate: async (newMessage: object) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["fetch_messages"] });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(["fetch_messages"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["fetch_messages"], (old: MessageType[]) => [
        ...old,
        newMessage,
      ]);

      // Return a context object with the snapshotted value
      return { previousMessages };
    },

    onError: (err, newMessage, context) => {
      queryClient.setQueryData(["fetch_messages"], context?.previousMessages);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch_messages"] });
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
    setEmojiPlate(false);
  };

  return (
    <form onSubmit={handleSubmit} className="absolute w-full bottom-5 px-4">
      <div className="flex bg-white py-2 px-4 items-center gap-3 rounded-full">
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

        {/* Emoji plate */}
        <EmojiPlate setMessage={setMessage} emojiPlate={emojiPlate} />

        {/* Emoji send button */}
        <div
          onClick={() => setEmojiPlate((prev) => !prev)}
          className="h-10 w-10 bg-zinc-200 hover:bg-violet-200 flex items-center justify-center rounded-full cursor-pointer transition-all"
        >
          {!emojiPlate ? (
            <MdEmojiEmotions className="shrink-0 text-violet-700" size={24} />
          ) : (
            <MdClose className="shrink-0 text-violet-700" size={24} />
          )}
        </div>

        {/* Mesasge send button */}
        <AnimatePresence mode="wait">
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
              transition={{
                ease: "backIn",
              }}
              onClick={handleSubmit}
              className="h-10 w-10 bg-zinc-200 hover:bg-violet-200 transition-colors flex items-center justify-center rounded-full cursor-pointer "
            >
              <BsFillSendFill className="shrink-0 text-violet-700" size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
};

export default ChatBoradForm;
