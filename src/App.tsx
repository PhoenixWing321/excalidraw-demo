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
    const validElements = excalidrawElements.filter(el => !el.isDeleted);
    
    // 只在元素数量变化时输出日志
    if (validElements.length !== elements.length) {
      console.log('Elements count changed:', validElements.length);
    }
    
    setElements(validElements);
    
    // 更新选中状态（只考虑未删除的元素）
    const newSelectedIds = validElements
      .filter(el => el.selected)
      .map(el => el.id);
    
    setSelectedKeys(newSelectedIds);
  }, [elements.length, setElements]);

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
                viewBackgroundColor: "#121212",
                currentItemStrokeColor: "#2f9e44",  // 设置默认边框颜
                currentItemStrokeWidth: 2,  // 设置边框宽度
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