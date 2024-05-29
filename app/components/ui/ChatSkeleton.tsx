import React from "react";

const ChatSkeleton = () => {
  return (
    <div className="flex animate-pulse flex-col gap-5 p-5">
      <div className="flex justify-start">
        <div className="ms-2 h-8 w-full max-w-[300px] rounded-b-lg rounded-tr-lg bg-gray-300 dark:bg-gray-600"></div>
      </div>

      <div className="flex justify-end">
        <div className="ms-2 h-10 w-full max-w-[300px] rounded-b-lg rounded-tl-lg bg-gray-300 dark:bg-gray-600"></div>
      </div>

      <div className="flex justify-start">
        <div className="ms-2 h-10 w-full max-w-[500px] rounded-b-lg rounded-tr-lg bg-gray-300 dark:bg-gray-600"></div>
      </div>

      <div className="flex justify-start">
        <div className="ms-2 h-8 w-full max-w-[80px] rounded-b-lg rounded-tr-lg bg-gray-300 dark:bg-gray-600"></div>
      </div>

      <div className="flex justify-end">
        <div className="ms-2 h-10 w-full max-w-[300px] rounded-b-lg rounded-tl-lg bg-gray-300 dark:bg-gray-600"></div>
      </div>

      <div className="flex justify-start">
        <div className="ms-2 h-10 w-full max-w-[100px] rounded-b-lg rounded-tr-lg bg-gray-300 dark:bg-gray-600"></div>
      </div>

      <div className="flex justify-end">
        <div className="ms-2 h-10 w-full max-w-[300px] rounded-b-lg rounded-tl-lg bg-gray-300 dark:bg-gray-600"></div>
      </div>

      <div className="flex justify-end">
        <div className="ms-2 h-10 w-full max-w-[200px] rounded-b-lg rounded-tl-lg bg-gray-300 dark:bg-gray-600"></div>
      </div>

      <div className="flex justify-end">
        <div className="ms-2 h-10 w-full max-w-[100px] rounded-b-lg rounded-tl-lg bg-gray-300 dark:bg-gray-600"></div>
      </div>
    </div>
  );
};

export default ChatSkeleton;
