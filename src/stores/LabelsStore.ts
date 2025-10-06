import { IGenericObject } from '@/types/generic';
import { create } from 'zustand';

interface LabelsState {
    labels: IGenericObject;
    setLabel: (key: string, value: string) => void;
    setLabels: (values: IGenericObject) => void;
}

export const useLabelsStore = create<LabelsState>((set, get) => ({
    labels: {},

    setLabel: (key: string, value: string) => {
        const labels = get().labels
        labels[key] = value
        set({ labels })
    },

    setLabels: (values: IGenericObject) => {
        set({ labels: values });
    }
}));
