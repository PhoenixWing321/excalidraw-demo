import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';  // 需要先安装 lodash: npm install lodash
import { nanoid } from 'nanoid';  // 如果需要生成唯一ID

import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawElement, ExcalidrawAPIRefValue } from "@excalidraw/excalidraw/types";
import { Tree } from 'antd';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import { useShapeStore } from './stores/shape-store';
import ShapeList from './components/ShapeList';  // 导入组件
import ShapeTable from './components/ShapeTable';
import MeasureButton from './components/MeasureButton';
import SearchImageButton from './components/SearchImageButton';

function App() {
  const { elements, setElements } = useShapeStore();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawAPIRefValue | null>(null);
  const [shapeCounter, setShapeCounter] = useState<{ [key: string]: number }>({
    rectangle: 0,
    ellipse: 0,
    diamond: 0,
    line: 0,
    image: 0
  });
  const [tableElements, setTableElements] = useState<ExcalidrawElement[]>([]);

  // 添加 onApiChange 回调函数
  const onApiChange = useCallback((api: ExcalidrawAPIRefValue) => {
    setExcalidrawAPI(api);
  }, []);

  const onChangeHandler = useCallback((excalidrawElements: ExcalidrawElement[]) => {
    // 检查新增的元素
    const currentIds = new Set(elements.map(el => el.id));
    const newElements = excalidrawElements.filter(el => !currentIds.has(el.id));

    // 如果有新元素，更新计数器
    if (newElements.length > 0) {
      newElements.forEach(el => {
        console.log('new element:', el);
        if (!el.isDeleted) {
          setShapeCounter(prev => ({
            ...prev,
            [el.type]: (prev[el.type] || 0) + 1
          }));
          // 添加自定义标题
          el.customData = {
            title: `${el.type}.${shapeCounter[el.type] + 1}`
          };
        }
      });
    }

    const validElements = excalidrawElements.filter(el => !el.isDeleted);
    setElements(validElements);

    const newSelectedIds = validElements
      .filter(el => el.selected)
      .map(el => el.id);
    setSelectedKeys(newSelectedIds);
  }, [elements, shapeCounter, setElements]);

  // 修改选择事件处理器
  const onExcalidrawSelectionChange = useCallback((elements: readonly ExcalidrawElement[]) => {
    // 不在这里处理选中状态，避免重复更新
  }, []);

  // 处理树节点选择
  const onSelect = (selectedKeys: string[], info: any) => {
    console.log('选中的节点:', selectedKeys);
    setSelectedKeys(selectedKeys);

    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        appState: {
          selectedElementIds: Object.fromEntries(
            selectedKeys.map(key => [key, true])
          ),
          editingElement: null,
          activeTool: { type: "selection" },
          cursorButton: "up",
        }
      });
    }
  };

  // 构建树形数据结构
  const treeData = useMemo(() => {
    const shapeTypes = {
      rectangle: '矩形',
      ellipse: '圆形',
      diamond: '菱形',
      line: '线条',
      image: '图片'
    };

    const data = Object.entries(shapeTypes).map(([type, label]) => {
      const shapes = elements.filter(el => !el.isDeleted && el.type === type);
      return {
        title: `${label} (${shapes.length})`,
        key: type,
        icon: <FolderOutlined />,
        children: shapes.map(shape => ({
          title: shape.customData?.title ||
            `${shape.type}.${shapeCounter[shape.type]} - ${shape.width?.toFixed(0)}x${shape.height?.toFixed(0)}`,
          key: shape.id,
          icon: type === 'image' ? '🖼️' : <FileOutlined />
        }))
      };
    }).filter(item => item.children.length > 0);

    return data;
  }, [elements, shapeCounter]);

  // 在显示总数时也要过滤掉已删除的元素
  const activeElementsCount = elements.filter(el => !el.isDeleted).length;

  const handleDisplayElementsChange = useCallback((elements: ExcalidrawElement[]) => {
    setTableElements(elements);
  }, []);

  const handleMeasure = useCallback((measurements: Map<string, any>) => {
    console.log('要测量的元素:', tableElements);  // 添加日志
    const updatedElements = elements.map(el => {
      const measurement = measurements.get(el.id);
      if (measurement) {
        return {
          ...el,
          customData: {
            ...el.customData,
            measurement
          }
        };
      }
      return el;
    });
    setElements(updatedElements);
  }, [elements, setElements, tableElements]);

  return (
    <div className="app-container">
      <div style={{ 
        display: 'flex', 
        height: "70vh",
        width: "100%" 
      }}>
        <div style={{ flex: 1 }}>
          <Excalidraw
            onChange={onChangeHandler}
            onPenUp={onExcalidrawSelectionChange}
            excalidrawAPI={onApiChange}
            initialData={{
              elements: elements,
              appState: {
                viewBackgroundColor: "#121212",
                currentItemStrokeColor: "#2f9e44",
                currentItemBackgroundColor: "transparent",  // 设置为透明
                currentItemFillStyle: "hachure",  // 或使用 "solid"
                currentItemStrokeWidth: 2,
              }
            }}
          />
        </div>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column'
        }}>
          <ShapeList
            elements={elements}
            selectedKeys={selectedKeys}
            shapeCounter={shapeCounter}
            onSelect={onSelect}
          />
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',  // 改为纵向排列
            gap: '8px' 
          }}>
            <SearchImageButton elements={elements} />
            <MeasureButton selectedKeys={selectedKeys} />
          </div>
        </div>
      </div>
      <div style={{ marginTop: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <ShapeTable
          elements={elements}
          selectedKeys={selectedKeys}
          onSelect={onSelect}
          onDisplayElementsChange={handleDisplayElementsChange}
        />
      </div>
    </div>
  );
}

// 需要扩展 ExcalidrawElement 类型以包含 customData
declare module '@excalidraw/excalidraw/types' {
  interface ExcalidrawElement {
    customData?: {
      title: string;
      measurement?: {
        rgb: [number, number, number];
        grayscale: number;
        average: number;
        timestamp: number;
      };
    };
  }
}

export default App;