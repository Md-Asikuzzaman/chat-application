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
    <form
      onSubmit={handleSubmit}
      className="absolute left-0 top-0 z-[999999] w-full"
    >
      <div className="relative flex flex-1 items-center gap-2 p-3">
        <div className="relative flex flex-1 items-center gap-3 rounded-full bg-white px-4 py-2">
          <TiAttachment className="shrink-0" size={30} />
          <input
            className="w-full py-3 outline-none outline-0"
            type="text"
            placeholder="Type a message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit" hidden className="hidden">
            send
          </button>

          {/* Emoji send button */}
          <div
            onClick={() => setEmojiPlate((prev) => !prev)}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-200 transition-all hover:bg-violet-200"
          >
            {!emojiPlate ? (
              <MdEmojiEmotions className="shrink-0 text-violet-700" size={24} />
            ) : (
              <MdClose className="shrink-0 text-violet-700" size={24} />
            )}
          </div>
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
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-200 transition-colors hover:bg-violet-200"
            >
              <BsFillSendFill className="shrink-0 text-violet-700" size={22} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emoji plate */}
        <EmojiPlate setMessage={setMessage} emojiPlate={emojiPlate} />
      </div>
    </form>
  );
};

export default ChatBoradForm;
