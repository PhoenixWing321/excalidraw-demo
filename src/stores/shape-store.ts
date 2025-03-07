import { create } from 'zustand';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';

interface ShapeStore {
  elements: ExcalidrawElement[];
  setElements: (elements: ExcalidrawElement[]) => void;
}

export const useShapeStore = create<ShapeStore>((set) => ({
  elements: [],
  setElements: (elements) => {
    console.log('Store updating elements:', elements);
    set({ elements });
  },
}));