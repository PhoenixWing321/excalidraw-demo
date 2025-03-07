import { create } from 'zustand';
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types";

interface ShapeStore {
  elements: ExcalidrawElement[];
  setElements: (elements: ExcalidrawElement[]) => void;
}

export const useShapeStore = create<ShapeStore>((set, get) => ({
  elements: [],
  setElements: (newElements) => {
    const currentElements = get().elements;
    
    // 检查是否有实际变化
    const hasChanged = 
      currentElements.length !== newElements.length ||
      JSON.stringify(newElements.map(el => ({
        id: el.id,
        type: el.type,
        isDeleted: el.isDeleted,
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height
      }))) !== JSON.stringify(currentElements.map(el => ({
        id: el.id,
        type: el.type,
        isDeleted: el.isDeleted,
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height
      })));

    if (hasChanged) {
      // console.log('Store updating elements:', newElements);  // 注释掉或删除这行
      set({ elements: newElements });
    }
  },
}));