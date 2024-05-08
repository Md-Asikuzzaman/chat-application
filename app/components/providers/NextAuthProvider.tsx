"use client";

import { NextPage } from "next";
import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

const NextAuthProvider: NextPage<Props> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthProvider;
