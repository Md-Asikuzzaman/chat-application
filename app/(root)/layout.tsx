import { NextPage } from "next";
import FriendList from "../components/section/FriendList";

interface Props {
  children: React.ReactNode;
}

const Layout: NextPage<Props> = ({ children }) => {
  return (
    <section className="min-h-screen w-full bg-slate-900">
      <div className="container mx-auto p-5 flex flex-col">
        <div className="bg-gray-200 rounded-xl flex-1 flex justify-between overflow-hidden">
          <FriendList />
          <div className="flex-1 px-4">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default Layout;
