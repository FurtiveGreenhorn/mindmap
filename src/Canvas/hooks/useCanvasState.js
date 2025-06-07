import { useState, useEffect } from 'react';

const useCanvasState = () => {
  // 設置畫布尺寸為5000x5000像素實現無限畫布
  const CANVAS_WIDTH = 5000;
  const CANVAS_HEIGHT = 5000;
  
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [viewportSize, setViewportSize] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  // 初始化視口大小
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 添加初始節點（在視口中心）
  useEffect(() => {
    if (nodes.length === 0) {
      addNode();
    }
  }, []);

  // 添加新節點（在選中節點附近或視口中心）
  const addNode = () => {
    let newNode;
    
    if (selectedNodeId) {
      // 在選中節點右下方添加新節點
      const selectedNode = nodes.find(n => n.id === selectedNodeId);
      newNode = {
        id: nodes.length + 1,
        x: selectedNode.x + (selectedNode.width || 160) + 40,
        y: selectedNode.y + 60,
        text: `節點${nodes.length + 1}`,
        width: 160,
        height: 60
      };
    } else {
      // 在視口中心添加新節點
      const viewportCenter = {
        x: viewportSize.width / 2 - 80,
        y: viewportSize.height / 2 - 30
      };
      
      newNode = {
        id: nodes.length + 1,
        x: viewportCenter.x,
        y: viewportCenter.y,
        text: `節點${nodes.length + 1}`,
        width: 160,
        height: 60
      };
    }
    
    if (selectedNodeId) {
      // 添加連接
      setConnections([...connections, {
        id: connections.length + 1,
        from: selectedNodeId,
        to: newNode.id
      }]);
    }
    
    setNodes([...nodes, newNode]);
  };

  // 更新節點文本
  const updateNodeText = (nodeId, text) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, text } : node
    ));
  };

  return {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    nodes,
    setNodes,
    connections,
    setConnections,
    selectedNodeId,
    setSelectedNodeId,
    viewportSize,
    addNode,
    updateNodeText
  };
};

export default useCanvasState;