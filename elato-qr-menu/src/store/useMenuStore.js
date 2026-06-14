import { create } from "zustand";

const useMenuStore = create((set) => ({
  selectedItem: null,
  isModalOpen: false,

  openItem: (item) => set({ selectedItem: item, isModalOpen: true }),
  closeItem: () => set({ isModalOpen: false, selectedItem: null }),
}));

export default useMenuStore;