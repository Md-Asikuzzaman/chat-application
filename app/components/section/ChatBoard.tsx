"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { NextPage } from "next";
import { LegacyRef, useEffect, useRef, useState } from "react";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { MdDelete } from "react-icons/md";
import clsx from "clsx";

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
  const queryClient = useQueryClient();

  // Fetch data based on receiverID and senderID
  const { data: messages, isLoading } = useQuery<MessageType[]>({
    queryKey: ["fetch_messages"],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/conversations/?senderId=${senderId}&receiverId=${receiverId}`,
        {
          baseURL: process.env.NEXTAUTH_URL,
        },
      );
      return data.messages;
    },

    enabled: receiverId && senderId ? true : false,
    refetchInterval: 1000,
  });

  // [DELETE] messages
  const { mutate } = useMutation({
    mutationKey: ["delete_message"],
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/messages/${id}`, {
        baseURL: process.env.NEXTAUTH_URL,
      });
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch_messages"],
      });
    },

    onMutate: async (id: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["fetch_messages"] });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(["fetch_messages"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["fetch_messages"], (old: MessageType[]) => {
        // Filter out posts with IDs present in the 'id' array
        return old.filter((message) => message.id !== id);
      });

      return { previousMessages };
    },

    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch_messages"] });
      // scrollToBottom();
    },
  });

  // Check the very last message is come from the server
  useEffect(() => {
    if (messages && previousMessages.length > 0) {
      if (messages.length > previousMessages.length) {
        scrollToBottom();
      } else if (messages.length < previousMessages.length) {
        scrollToBottom();
      }
    }

    // Update previousMessages with the latest messages
    setPreviousMessages(messages || []);
  }, [messages]);

  // Filter all messages by sender and receiver id
  const filteredMessage = messages?.filter(
    (message) =>
      (message.senderId === senderId && message.receiverId === receiverId) ||
      (message.receiverId === senderId && message.senderId === receiverId),
  );

  // Check chat Inview
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      updateStatus(receiverId);
    }
  }, [inView]);

  // [UPDATE] message based on InView
  const { mutate: updateStatus } = useMutation({
    mutationKey: ["update_message"],
    mutationFn: async (id: string) => {
      const { data } = await axios.patch(`/api/messages/${id}`, {
        baseURL: process.env.NEXTAUTH_URL,
      });
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch_messages", "fetch_users"],
      });
    },
  });

  // check
  const { data: getMessages } = useQuery<MessageType[]>({
    queryKey: ["getMessage"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/messages/${receiverId}`, {
        baseURL: process.env.NEXTAUTH_URL,
      });

      return data.messages;
    },

    refetchInterval: 1000,

    enabled: receiverId ? true : false,
  });

  // Filter all messages by sender and receiver id
  const filteredMessageForLast = getMessages?.filter(
    (message) =>
      message.senderId === senderId ||
      (message.receiverId === receiverId && message.senderId === receiverId) ||
      message.receiverId === senderId,
  );

  if (isLoading) {
    return <h3 className="px-4">loading...</h3>;
  }

  return (
    <div
      className="flex h-[calc(100vh-170px)] flex-col gap-3 overflow-x-hidden overflow-y-scroll px-5 py-2"
      ref={scrollRef}
    >
      <AnimatePresence mode="popLayout">
        {messages?.map((data, i) => (
          <motion.div
            initial={{
              scale: 0,
              opacity: 0,
              y: 200,
              visibility: "hidden",
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              visibility: "visible",
            }}
            transition={{
              ease: "backInOut",
            }}
            key={i}
            className={`flex shrink-0 ${
              senderId === data.senderId ? "justify-end" : "justify-start"
            }`}
          >
            {/* main chat */}
            <div
              className="group/item flex max-w-[90%] items-center gap-1"
              ref={
                filteredMessageForLast && filteredMessageForLast.length - 1
                  ? ref
                  : null
              }
            >
              <div
                onClick={() => mutate(data.id && data.id)}
                className={`grid h-6 w-6 shrink-0 translate-x-10 cursor-pointer place-content-center rounded-full bg-zinc-300 transition-transform group-hover/item:translate-x-0 ${
                  senderId === data.senderId ? "grid" : "hidden"
                }`}
              >
                <MdDelete className="text-zinc-500" />
              </div>
              <p
                className={clsx(
                  "z-20 inline-block px-4 py-3  selection:bg-slate-900 selection:text-green-600",
                  senderId === data.senderId
                    ? "rounded-b-2xl rounded-s-2xl bg-[#6918b4] text-white"
                    : "rounded-b-2xl rounded-e-2xl bg-[#E1D1F0] text-[#8318b4]",
                )}
              >
                {data.message}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ChatBoard;
