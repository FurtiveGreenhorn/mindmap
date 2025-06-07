import { useState } from 'react';

const useResizeHandlers = (canvasRef, nodes, setNodes) => {
  const [resizing, setResizing] = useState(false);
  const [resizeNodeId, setResizeNodeId] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });

  // 開始節點縮放
  const startResize = (e, nodeId) => {
    setResizing(true);
    setResizeNodeId(nodeId);
    setResizeStart({ x: e.clientX, y: e.clientY });
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    setOriginalSize({ width: node.width || 160, height: node.height || 60 });
  };

  // 縮放處理
  const handleResize = (e) => {
    if (resizing) {
      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(120, originalSize.width + deltaX);
      const newHeight = Math.max(60, originalSize.height + deltaY);
      
      setNodes(prevNodes => prevNodes.map(node =>
        node.id === resizeNodeId ? { ...node, width: newWidth, height: newHeight } : node
      ));
    }
  };

  // 結束縮放
  const endResize = () => {
    setResizing(false);
  };

  return {
    startResize,
    handleResize,
    endResize,
    resizing,
    resizeNodeId
  };
};

export default useResizeHandlers;