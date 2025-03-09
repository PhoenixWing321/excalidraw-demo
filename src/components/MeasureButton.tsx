import { FC, useEffect } from 'react';
import { Button } from 'antd';
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types";
import type { ExcalidrawAPIRefValue } from "@excalidraw/excalidraw/types";
import { MeasureCore } from '../core/measure-core';
import { useMeasureStore } from '../store/useMeasureStore';

interface MeasureButtonProps {
  elements: ExcalidrawElement[];
  onMeasure: (measurements: Map<string, any>) => void;
  excalidrawAPI?: ExcalidrawAPIRefValue | null;
  selectedKeys: string[];
}

export const MeasureButton: FC<MeasureButtonProps> = ({ elements, onMeasure, excalidrawAPI, selectedKeys }) => {
  const { imageElements = [], measureCore } = useMeasureStore();
  
  // 只在开发环境下，且只在组件挂载时输出一次日志
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('MeasureButton mounted:', {
        imageElements: imageElements?.length || 0,
        selectedKeys: selectedKeys?.length || 0,
      });
    }
  }, []); // 只在组件挂载时执行一次

  // 确保所有值都有默认值
  const hasSelectedImage = imageElements?.length >0 || false;

  const handleMeasure = async () => {
    if (!hasSelectedImage) return;
    try {
      const measureCore = new MeasureCore(excalidrawAPI, elements);
      const measurements = await measureCore.measure();
      console.log('Measurement results:', measurements);
      onMeasure(measurements);
    } catch (error) {
      console.error('Measurement failed:', error);
    }
  };

  // 使用模板字符串，避免直接访问 length
  const buttonText = hasSelectedImage 
    ? `测量图像 [数量:${imageElements?.length || 0}]` 
    : `(请选图像)[数量:${imageElements?.length || 0}]`;

  return (
    <Button 
      type="primary"
      onClick={handleMeasure}
      disabled={!hasSelectedImage}
    >
      {buttonText}
    </Button>
  );
};

export default MeasureButton; 