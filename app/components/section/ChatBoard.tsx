"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { NextPage } from "next";
import { LegacyRef, useEffect, useRef, useState } from "react";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { MdDelete } from "react-icons/md";

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
  const {
    data: messages,
    isLoading,
    isPending,
  } = useQuery<MessageType[]>({
    queryKey: ["fetch_messages"],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/conversations/?senderId=${senderId}&receiverId=${receiverId}`,
        {
          baseURL: process.env.NEXTAUTH_URL,
        }
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
      (message.receiverId === senderId && message.senderId === receiverId)
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

  if (isLoading) {
    return <h3 className="px-4">loading...</h3>;
  }

  return (
    <div
      className="flex flex-col gap-3 h-[calc(100vh-210px)] overflow-y-scroll overflow-x-hidden px-5 py-2"
      ref={scrollRef}
    >
      <AnimatePresence mode="popLayout">
        {messages?.map((data, i) => (
          <motion.div
            initial={{
              scale: 0,
              opacity: 0,
              y: 200,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
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
              className="flex items-center gap-1 max-w-[90%] group/item"
              ref={ref}
            >
              <div
                onClick={() => mutate(data.id && data.id)}
                className={`h-6 w-6 bg-zinc-300 grid place-content-center rounded-full cursor-pointer translate-x-10 group-hover/item:translate-x-0 shrink-0 transition-transform ${
                  senderId === data.senderId ? "grid" : "hidden"
                }`}
              >
                <MdDelete className="text-zinc-500" />
              </div>
              <p
                className={`inline-block py-3 px-4 rounded-xl text-white z-20 selection:text-green-600 selection:bg-slate-900 ${
                  senderId === data.senderId ? "bg-violet-500" : "bg-zinc-500"
                }`}
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
