import { NextPage } from "next";
import FriendList from "../components/section/FriendList";

interface Props {
  children: React.ReactNode;
}

const Layout: NextPage<Props> = ({ children }) => {
  return (
    <section className="min-h-screen w-full bg-slate-900">
      <div className="mx-auto lg:container">
        <div className="flex min-h-screen flex-1 overflow-x-scroll bg-gray-200 lg:overflow-hidden lg:rounded-xl">
          <FriendList />
          <div className="min-w-[400px] flex-1 md:min-w-[500px]">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Layout;
