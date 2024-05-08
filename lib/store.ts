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
