// store/useModeStore.ts
import { create } from "zustand";

type DecksModeStore = {
    editMode: boolean
    toggleEditMode: () => void

    editable: boolean;
    reorderable: boolean;
    toggleEditable: () => void;
    toggleReorderable: () => void;
    setEditable: (on: boolean) => void;
    setReorderable: (on: boolean) => void;

    
};

export const useDecksModeStore = create<DecksModeStore>((set) => ({
    editMode: false,
    toggleEditMode: () => set((state) => ({editMode: !state.editMode})),

    editable: false,
    reorderable: false,
    toggleEditable: () => set((state) => ({ editable: !state.editable })),
    toggleReorderable: () => set((state) => ({ reorderable: !state.reorderable })),
    setEditable: (on) => set({ editable: on }),
    setReorderable: (on) => set({ reorderable: on }),
}));