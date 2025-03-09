import { Button } from 'antd';
import { useMeasureStore } from '../store/useMeasureStore';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';

export default function SearchImageButton({ elements }: { elements: ExcalidrawElement[] }) {
  const searchImages = useMeasureStore(state => state.searchImages);
  
  return (
    <Button 
      onClick={() => searchImages(elements)}
      type="default"
    >
      搜索图片元素
    </Button>
  );
} 