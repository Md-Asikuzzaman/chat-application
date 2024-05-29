"use client";

import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { BsFillSendFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { MdClose, MdEmojiEmotions } from "react-icons/md";
import { FaRegImage } from "react-icons/fa6";
import { _64ify } from "next-file-64ify";
import axios from "axios";
import clsx from "clsx";

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

  // [SEND] message
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
        type: "text",
      });
    }
    setMessage("");
    setEmojiPlate(false);
  };

  const [myFile, setMyFile] = useState<string>("");
  const [fileModal, setFileModal] = useState<boolean>(false);

  const allowedTypes = ["image/jpeg", "image/png"];
  const allowedFileSize = { minSize: 0, maxSize: 1024 };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const { data, isLoading, isError, isValidSize } = await _64ify(
        file,
        allowedTypes,
        allowedFileSize,
      );

      data && setMyFile(data);
      setFileModal(true);
    }
  };

  // file upload
  const handleFileUpload = () => {
    myFile &&
      mutate({
        message: myFile,
        senderId,
        receiverId,
        type: "file",
      });

    setFileModal(false);
    setMyFile("");
  };

  return (
    <form onSubmit={handleSubmit} className="absolute bottom-2 left-0 right-0">
      <div className="relative flex flex-1 items-center gap-2 p-3">
        <div className="relative flex flex-1 items-center gap-3 rounded-full bg-white px-4 py-2">
          <label>
            <div className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-zinc-200">
              <FaRegImage className="shrink-0 text-violet-700" size={22} />
            </div>
            <input
              hidden
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
            />
          </label>
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

        {/* file modal */}
        <div
          className={clsx(
            "absolute bottom-0 right-0 z-[999999]  h-auto w-[300px] -translate-x-[50px] -translate-y-[100px] rounded-lg bg-white px-4 pt-4 shadow-xl",
            fileModal ? "block" : "hidden",
          )}
        >
          <img src={myFile} alt="file" className="h-full w-full" />
          <div className="flex flex-row-reverse items-center gap-2 py-2">
            <div
              onClick={handleFileUpload}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-zinc-200"
            >
              <IoMdSend size={18} />
            </div>

            <div
              onClick={() => {
                setFileModal(false);
                setMyFile("");
              }}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-zinc-200"
            >
              <MdClose size={20} />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChatBoradForm;
