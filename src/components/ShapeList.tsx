import { FC } from 'react';
import { Tree } from 'antd';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types";

// 定义组件的 props 接口
interface ShapeListProps {
  elements: ExcalidrawElement[];
  selectedKeys: string[];
  shapeCounter: { [key: string]: number };
  onSelect: (selectedKeys: string[], info: any) => void;
}

// 使用 FC (FunctionComponent) 类型来定义组件
const ShapeList: FC<ShapeListProps> = ({ 
  elements, 
  selectedKeys, 
  shapeCounter, 
  onSelect 
}) => {
  // 构建树形数据结构
  const treeData = Object.entries({
    rectangle: '矩形',
    ellipse: '圆形',
    diamond: '菱形',
    line: '线条',
    image: '图片'
  }).map(([type, label]) => {
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

  const activeElementsCount = elements.filter(el => !el.isDeleted).length;

  return (
    <div style={{ 
      width: '250px', 
      padding: '10px', 
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    }}>
      <h3>形状列表 ({activeElementsCount})</h3>
      <Tree
        style={{ 
          flex: 1,
          overflow: 'auto'
        }}
        showIcon
        defaultExpandAll
        treeData={treeData}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
      />
    </div>
  );
};

export default ShapeList; 