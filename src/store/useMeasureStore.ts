import { create } from 'zustand';
import { MeasureCore } from '../core/measure-core';
import { ExcalidrawImageElement, ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';

interface MeasureState {
  measureCore: MeasureCore;
  imageElements: ExcalidrawImageElement[];
  searchImages: (elements: ExcalidrawElement[]) => void;
}

export const useMeasureStore = create<MeasureState>((set) => ({
  measureCore: new MeasureCore(),
  imageElements: [],
  searchImages: (elements) => {
    const imageElements = useMeasureStore.getState().measureCore.searchImageElements(elements);
    set({ imageElements });
  },
})); 