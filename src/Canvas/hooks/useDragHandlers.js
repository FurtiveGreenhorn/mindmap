import { useState } from 'react';

const useDragHandlers = (canvasRef, nodes, selectedNodeId, setNodes, setSelectedNodeId) => {
  const [dragging, setDragging] = useState(false);
  const [draggingCanvas, setDraggingCanvas] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasDragStart, setCanvasDragStart] = useState({ x: 0, y: 0 });

  // 開始拖拽節點
  const startNodeDrag = (e, nodeId) => {
    setSelectedNodeId(nodeId);
    setDragging(true);
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y
    });
  };

  // 開始畫布拖拽
  const startCanvasDrag = (e) => {
    // 檢查是否點擊在節點上
    if (e.target.closest('.node')) return;
    
    setDraggingCanvas(true);
    setCanvasDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };

  // 拖拽中（節點或畫布）
  const onDrag = (e) => {
    if (draggingCanvas) {
      // 拖拽畫布
      const deltaX = e.clientX - canvasDragStart.x;
      const deltaY = e.clientY - canvasDragStart.y;
      
      // 移動所有節點
      setNodes(prevNodes => prevNodes.map(node => ({
        ...node,
        x: node.x + deltaX,
        y: node.y + deltaY
      })));
      
      setCanvasDragStart({ x: e.clientX, y: e.clientY });
      return;
    }
    
    if (dragging) {
      // 拖拽節點
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;
      
      setNodes(prevNodes => prevNodes.map(node =>
        node.id === selectedNodeId ? { ...node, x, y } : node
      ));
    }
  };

  // 結束拖拽
  const endDrag = () => {
    setDragging(false);
    setDraggingCanvas(false);
  };

  return {
    startNodeDrag,
    startCanvasDrag,
    onDrag,
    endDrag,
    dragging,
    draggingCanvas
  };
};

export default useDragHandlers;