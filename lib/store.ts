import { create } from "zustand";

type MenuStore = {
  menuActive: {};
  setMenuActive: {};
};

export const useMenuActive = create<MenuStore>()((set) => ({
  menuActive: {},
  setMenuActive: (value?: boolean) =>
    set((state) => ({
      menuActive: value ? value : !state.menuActive,
    })),
}));

type FriendListStore = {
  friendListActive: boolean;
  setFriendListActive: () => void;
};

export const useFriendListActive = create<FriendListStore>()((set) => ({
  friendListActive: true,
  setFriendListActive: () =>
    set((state) => ({
      friendListActive: !state.friendListActive,
    })),
}));
