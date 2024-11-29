import { create } from "zustand";

interface DialogOpenStoreInterface {
  open: boolean;
  setOpen: (item: boolean) => void;
  createOpen: boolean;
  setCreateOpen: (item: boolean) => void;
}

const useDialogOpenStore = create<DialogOpenStoreInterface>((set) => ({
  open: false,
  setOpen: (item) => set({ open: item }),
  createOpen: false,
  setCreateOpen: (item) => set({ createOpen: item }),
}));

export default useDialogOpenStore;
