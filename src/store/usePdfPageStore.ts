import { create } from "zustand";

interface PdfPageStoreInterface {
  pageNumber: number;
  setPageNumber: (item: number) => void;
}

const usePdfPageStore = create<PdfPageStoreInterface>((set) => ({
  pageNumber: 1,
  setPageNumber: (item) => set({ pageNumber: item }),
}));

export default usePdfPageStore;
