'use client';

import { create } from 'zustand';

type State = {
    isLoading: boolean;
};

type Actions = {
    startLoading: () => void;
    stopLoading: () => void;
};

const useLoadingBarStore = create<State & Actions>((set) => ({
    isLoading: false,
    startLoading: () => set({ isLoading: true }),
    stopLoading: () => set({ isLoading: false }),
}));

export const useLoadingBar = () => {
    const isLoading = useLoadingBarStore((state) => state.isLoading);
    const startLoading = useLoadingBarStore((state) => state.startLoading);
    const stopLoading = useLoadingBarStore((state) => state.stopLoading);

    return { isLoading, startLoading, stopLoading };
};
