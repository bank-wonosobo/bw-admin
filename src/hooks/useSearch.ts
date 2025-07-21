import { create } from "zustand";

type Search = {
  search: string;
  setSearch: (value: string) => void;
};

export const useSearch = create<Search>((set) => ({
  search: "",
  setSearch: (value) => set({ search: value }),
}));
