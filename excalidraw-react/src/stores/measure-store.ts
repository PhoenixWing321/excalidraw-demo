import { create } from 'zustand';
import { MeasureCore } from '../core/measure-core';
import { ExcalidrawImageElement } from '@excalidraw/excalidraw/types/element/types';

interface MeasureState {
  measureCore: MeasureCore;
  imageElements: ExcalidrawImageElement[];
  getImageCount: () => number;
}

export const useMeasureStore = create<MeasureState>((set, get) => ({
  measureCore: new MeasureCore(),
  imageElements: [],
  getImageCount: () => get().imageElements.length
})); 