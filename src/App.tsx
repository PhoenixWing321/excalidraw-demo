import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';  // 需要先安装 lodash: npm install lodash

import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawElement, ExcalidrawAPIRefValue } from "@excalidraw/excalidraw/types";
import { Tree } from 'antd';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import { useShapeStore } from './stores/shape-store';

function App() {
  const { elements, setElements } = useShapeStore();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawAPIRefValue | null>(null);

  // 添加 onApiChange 回调函数
  const onApiChange = useCallback((api: ExcalidrawAPIRefValue) => {
    setExcalidrawAPI(api);
  }, []);

  const onChangeHandler = useCallback((excalidrawElements: ExcalidrawElement[]) => {
    // 检查是否有实际变化（添加、删除、修改）
    const hasRealChange = elements.length !== excalidrawElements.length ||
      excalidrawElements.some(el => el.isDeleted) ||
      elements.some((el, index) => {
        const newEl = excalidrawElements[index];
        return el.type !== newEl?.type || 
               el.width !== newEl?.width || 
               el.height !== newEl?.height ||
               el.isDeleted !== newEl?.isDeleted;
      });

    if (hasRealChange) {
      console.log('Elements actually changed:', excalidrawElements);
      setElements([...excalidrawElements]);
    }
    
    // 只在选中状态改变时更新
    const newSelectedIds = excalidrawElements
      .filter(el => el.selected)
      .map(el => el.id);
    
    if (JSON.stringify(newSelectedIds) !== JSON.stringify(selectedKeys)) {
      setSelectedKeys(newSelectedIds);
    }
  }, [elements, selectedKeys, setElements]);

  // 添加画板选择事件处理
  const onExcalidrawSelectionChange = useCallback((elements: readonly ExcalidrawElement[]) => {
    const selectedIds = elements
      .filter(el => el.selected)
      .map(el => el.id);
    setSelectedKeys(selectedIds);
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
    console.log('Rebuilding tree data with elements:', elements);
    const shapeTypes = {
      rectangle: '矩形',
      ellipse: '圆形',
      diamond: '菱形',
      line: '线条',
      image: '图片'
    };

    const data = Object.entries(shapeTypes).map(([type, label]) => {
      // 过滤掉已删除的元素
      const shapes = elements.filter(el => !el.isDeleted && el.type === type);
      return {
        title: `${label} (${shapes.length})`,
        key: type,
        icon: <FolderOutlined />,
        children: shapes.map(shape => ({
          title: type === 'image' 
            ? `图片 - ${shape.width?.toFixed(0)}x${shape.height?.toFixed(0)}`
            : `${shape.type} - ${shape.width?.toFixed(0)}x${shape.height?.toFixed(0)}`,
          key: shape.id,
          icon: type === 'image' ? '🖼️' : <FileOutlined />
        }))
      };
    }).filter(item => item.children.length > 0);

    return data;
  }, [elements]);

  // 在显示总数时也要过滤掉已删除的元素
  const activeElementsCount = elements.filter(el => !el.isDeleted).length;

  return (
    // 使用明确语义的容器替代空标签
    <div className="app-container">
      {/* Excalidraw 画板 */}

      <div style={{ display: 'flex', height: "70vh", width: "100%" }}>
        <div style={{ flex: 1 }}>
          <Excalidraw
            onChange={onChangeHandler}
            onPenUp={onExcalidrawSelectionChange}
            excalidrawAPI={onApiChange}
            initialData={{
              elements: elements,
              appState: {
                viewBackgroundColor: "#121212"
              }
            }}
          />
        </div>
        <div style={{ width: '250px', padding: '10px', backgroundColor: '#f5f5f5' }}>
          <h3>形状列表 ({activeElementsCount})</h3>
          <Tree
            showIcon
            defaultExpandAll
            treeData={treeData}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
          />
        </div>
      </div>
    </div>
  );
}

export default App;