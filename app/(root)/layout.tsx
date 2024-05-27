import { NextPage } from "next";
import FriendList from "../components/section/FriendList";

interface Props {
  children: React.ReactNode;
}

const Layout: NextPage<Props> = ({ children }) => {
  return (
    <section className="min-h-screen w-full bg-slate-900">
      <div className="mx-auto lg:container">
        <div className="flex min-h-screen flex-1 bg-gray-100 lg:overflow-hidden lg:rounded-xl">
          <FriendList />
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Layout;
