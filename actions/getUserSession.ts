import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function getUserSession() {
  return await getServerSession(authOptions);
}
