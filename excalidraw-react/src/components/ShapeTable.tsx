import { FC, useState, useEffect } from 'react';
import { Table } from 'antd';
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types";
import type { ColumnsType } from 'antd/es/table';

interface ShapeTableProps {
  elements: ExcalidrawElement[];
  selectedKeys: string[];
  onSelect: (selectedKeys: string[]) => void;
  onDisplayElementsChange?: (elements: ExcalidrawElement[]) => void;
}

const ShapeTable: FC<ShapeTableProps> = ({ 
  elements, 
  selectedKeys, 
  onSelect,
  onDisplayElementsChange 
}) => {
  // 添加状态来存储表格显示的元素
  const [displayElements, setDisplayElements] = useState<ExcalidrawElement[]>([]);

  // 当 elements 变化时更新显示元素
  useEffect(() => {
    const filtered = elements.filter(el => 
      !el.isDeleted && 
      !['image', 'text'].includes(el.type)
    );
    setDisplayElements(filtered);
    onDisplayElementsChange?.(filtered);
  }, [elements, onDisplayElementsChange]);

  // 弧度转角度的辅助函数
  const radiansToDegrees = (radians: number): number => {
    return (radians * 180) / Math.PI;
  };

  const columns: ColumnsType<ExcalidrawElement> = [
    {
      title: '名称',
      dataIndex: 'customData',
      key: 'name',
      render: (customData) => customData?.title || '未命名',
      sorter: (a, b) => (a.customData?.title || '').localeCompare(b.customData?.title || '')
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      filters: [
        { text: '矩形', value: 'rectangle' },
        { text: '圆形', value: 'ellipse' },
        { text: '菱形', value: 'diamond' },
        { text: '线条', value: 'line' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'X',
      dataIndex: 'x',
      key: 'x',
      width: 80,
      render: (value) => value.toFixed(0),
      sorter: (a, b) => a.x - b.x,
    },
    {
      title: 'Y',
      dataIndex: 'y',
      key: 'y',
      width: 80,
      render: (value) => value.toFixed(0),
      sorter: (a, b) => a.y - b.y,
    },
    {
      title: '宽度',
      dataIndex: 'width',
      key: 'width',
      width: 80,
      render: (value) => value?.toFixed(0) || '-',
      sorter: (a, b) => (a.width || 0) - (b.width || 0),
    },
    {
      title: '高度',
      dataIndex: 'height',
      key: 'height',
      width: 80,
      render: (value) => value?.toFixed(0) || '-',
      sorter: (a, b) => (a.height || 0) - (b.height || 0),
    },
    {
      title: '旋转角度',
      dataIndex: 'angle',
      key: 'angle',
      width: 90,
      render: (radians) => `${radiansToDegrees(radians).toFixed(1)}°`,
      sorter: (a, b) => radiansToDegrees(a.angle) - radiansToDegrees(b.angle),
    },
    {
      title: 'RGB',
      dataIndex: ['customData', 'measurement', 'rgb'],
      key: 'rgb',
      width: 120,
      render: (rgb) => rgb ? `(${rgb.join(', ')})` : '-',
    },
    {
      title: '灰度值',
      dataIndex: ['customData', 'measurement', 'grayscale'],
      key: 'grayscale',
      width: 80,
      render: (value) => value ?? '-',
    },
    {
      title: '平均值',
      dataIndex: ['customData', 'measurement', 'average'],
      key: 'average',
      width: 80,
      render: (value) => value ?? '-',
    },
    {
      title: '测量时间',
      dataIndex: ['customData', 'measurement', 'timestamp'],
      key: 'measureTime',
      width: 180,
      render: (timestamp) => timestamp ? new Date(timestamp).toLocaleString() : '-',
    }
  ];

  return (
    <div style={{ padding: '10px' }}>
      <Table
        columns={columns}
        dataSource={displayElements}
        rowKey="id"
        size="small"
        pagination={{ pageSize: 10 }}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: (selectedRowKeys) => onSelect(selectedRowKeys as string[]),
        }}
        scroll={{ y: 400, x: 'max-content' }}
      />
    </div>
  );
};

export default ShapeTable; 