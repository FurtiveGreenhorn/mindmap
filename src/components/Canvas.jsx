import React, { useState, useRef, useEffect } from 'react';

const Canvas = () => {
  // 设置画布尺寸为5000x5000像素实现无限画布
  const CANVAS_WIDTH = 5000;
  const CANVAS_HEIGHT = 5000;
  
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [draggingCanvas, setDraggingCanvas] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasDragStart, setCanvasDragStart] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [resizeNodeId, setResizeNodeId] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [hoverState, setHoverState] = useState({
    nodeId: null,
    area: null // 'content', 'resize'
  });
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // 初始化视口大小
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

  // 添加初始节点（在视口中心）
  useEffect(() => {
    if (nodes.length === 0) {
      addNode();
    }
  }, []);

  // 添加新节点（在选中节点附近或视口中心）
  const addNode = () => {
    let newNode;
    
    if (selectedNodeId) {
      // 在选中节点右下方添加新节点
      const selectedNode = nodes.find(n => n.id === selectedNodeId);
      newNode = {
        id: nodes.length + 1,
        x: selectedNode.x + (selectedNode.width || 160) + 40,
        y: selectedNode.y + 60,
        text: `节点${nodes.length + 1}`,
        width: 160,
        height: 60
      };
    } else {
      // 在视口中心添加新节点
      const viewportCenter = {
        x: viewportSize.width / 2 - 80,
        y: viewportSize.height / 2 - 30
      };
      
      newNode = {
        id: nodes.length + 1,
        x: viewportCenter.x,
        y: viewportCenter.y,
        text: `节点${nodes.length + 1}`,
        width: 160,
        height: 60
      };
    }
    
    if (selectedNodeId) {
      // 添加连接
      setConnections([...connections, {
        id: connections.length + 1,
        from: selectedNodeId,
        to: newNode.id
      }]);
    }
    
    setNodes([...nodes, newNode]);
  };

  // 开始拖拽节点
  const startNodeDrag = (e, nodeId) => {
    setSelectedNodeId(nodeId);
    
    // 根据悬停区域决定操作类型
    if (hoverState.area === 'resize') {
      setResizing(true);
      setResizeNodeId(nodeId);
      setResizeStart({ x: e.clientX, y: e.clientY });
      
      const node = nodes.find(n => n.id === nodeId);
      setOriginalSize({ width: node.width || 160, height: node.height || 60 });
    } else {
      setDragging(true);
      const node = nodes.find(n => n.id === nodeId);
      const rect = canvasRef.current.getBoundingClientRect();
      
      setDragOffset({
        x: e.clientX - rect.left - node.x,
        y: e.clientY - rect.top - node.y
      });
    }
  };

  // 开始画布拖拽
  const startCanvasDrag = (e) => {
    // 检查是否点击在节点上
    if (e.target.closest('.node')) return;
    
    setDraggingCanvas(true);
    setCanvasDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };

  // 拖拽中（节点、画布或调整大小）
  const onDrag = (e) => {
    if (draggingCanvas) {
      // 拖拽画布
      const deltaX = e.clientX - canvasDragStart.x;
      const deltaY = e.clientY - canvasDragStart.y;
      
      // 移动所有节点
      setNodes(nodes.map(node => ({
        ...node,
        x: node.x + deltaX,
        y: node.y + deltaY
      })));
      
      setCanvasDragStart({ x: e.clientX, y: e.clientY });
      return;
    }
    
    if (dragging) {
      // 拖拽节点
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;
      
      setNodes(nodes.map(node => 
        node.id === selectedNodeId ? { ...node, x, y } : node
      ));
    }
    
    if (resizing) {
      // 调整节点大小
      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(120, originalSize.width + deltaX);
      const newHeight = Math.max(60, originalSize.height + deltaY);
      
      setNodes(nodes.map(node => 
        node.id === resizeNodeId ? { ...node, width: newWidth, height: newHeight } : node
      ));
    }
  };

  // 结束拖拽
  const endDrag = () => {
    setDragging(false);
    setResizing(false);
    setDraggingCanvas(false);
  };

  // 检测悬停区域
  const checkHoverArea = (e, node) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const threshold = 10;
    
    // 检查是否在调整大小区域（右下角）
    if (x > rect.width - threshold && y > rect.height - threshold) {
      return 'resize';
    }
    return 'content';
  };

  // 获取节点四条边的中点
  const getNodeEdgeMidpoints = (node) => {
    const width = node.width || 160;
    const height = node.height || 60;
    return {
      top: { x: node.x + width / 2, y: node.y },
      right: { x: node.x + width, y: node.y + height / 2 },
      bottom: { x: node.x + width / 2, y: node.y + height },
      left: { x: node.x, y: node.y + height / 2 }
    };
  };

  // 计算两点间距离
  const distance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  // 找到两个节点最近边的中点
  const findClosestMidpoints = (node1, node2) => {
    const midpoints1 = getNodeEdgeMidpoints(node1);
    const midpoints2 = getNodeEdgeMidpoints(node2);
    
    const pairs = [
      { p1: midpoints1.top, p2: midpoints2.top, dist: distance(midpoints1.top, midpoints2.top) },
      { p1: midpoints1.top, p2: midpoints2.right, dist: distance(midpoints1.top, midpoints2.right) },
      { p1: midpoints1.top, p2: midpoints2.bottom, dist: distance(midpoints1.top, midpoints2.bottom) },
      { p1: midpoints1.top, p2: midpoints2.left, dist: distance(midpoints1.top, midpoints2.left) },
      
      { p1: midpoints1.right, p2: midpoints2.top, dist: distance(midpoints1.right, midpoints2.top) },
      { p1: midpoints1.right, p2: midpoints2.right, dist: distance(midpoints1.right, midpoints2.right) },
      { p1: midpoints1.right, p2: midpoints2.bottom, dist: distance(midpoints1.right, midpoints2.bottom) },
      { p1: midpoints1.right, p2: midpoints2.left, dist: distance(midpoints1.right, midpoints2.left) },
      
      { p1: midpoints1.bottom, p2: midpoints2.top, dist: distance(midpoints1.bottom, midpoints2.top) },
      { p1: midpoints1.bottom, p2: midpoints2.right, dist: distance(midpoints1.bottom, midpoints2.right) },
      { p1: midpoints1.bottom, p2: midpoints2.bottom, dist: distance(midpoints1.bottom, midpoints2.bottom) },
      { p1: midpoints1.bottom, p2: midpoints2.left, dist: distance(midpoints1.bottom, midpoints2.left) },
      
      { p1: midpoints1.left, p2: midpoints2.top, dist: distance(midpoints1.left, midpoints2.top) },
      { p1: midpoints1.left, p2: midpoints2.right, dist: distance(midpoints1.left, midpoints2.right) },
      { p1: midpoints1.left, p2: midpoints2.bottom, dist: distance(midpoints1.left, midpoints2.bottom) },
      { p1: midpoints1.left, p2: midpoints2.left, dist: distance(midpoints1.left, midpoints2.left) },
    ];
    
    // 找到距离最小的点对
    let minDist = Infinity;
    let closestPair = null;
    
    for (const pair of pairs) {
      if (pair.dist < minDist) {
        minDist = pair.dist;
        closestPair = pair;
      }
    }
    
    return closestPair;
  };

  return (
    <div 
      className="w-full h-full overflow-hidden"
      ref={containerRef}
      onMouseDown={startCanvasDrag}
    >
      <div 
        ref={canvasRef}
        className="relative bg-gradient-to-br from-gray-50 to-gray-100"
        style={{ 
          width: `${CANVAS_WIDTH}px`, 
          height: `${CANVAS_HEIGHT}px`
        }}
        onMouseMove={onDrag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        {/* 连接线 */}
        <svg 
          className="absolute top-0 left-0 pointer-events-none" 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT}
        >
          {connections.map(conn => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            
            if (!fromNode || !toNode) return null;
            
            // 找到最近边的中点作为连线端点
            const { p1, p2 } = findClosestMidpoints(fromNode, toNode);
            
            return (
              <line
                key={conn.id}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="#4F46E5"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            );
          })}
          <defs>
            <marker 
              id="arrowhead" 
              markerWidth="10" 
              markerHeight="7" 
              refX="10" 
              refY="3.5" 
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#4F46E5" />
            </marker>
          </defs>
        </svg>

        {/* 节点 */}
        {nodes.map(node => {
          const nodeWidth = node.width || 160;
          const nodeHeight = node.height || 60;
          const isHovered = hoverState.nodeId === node.id;
          const isSelected = selectedNodeId === node.id;
          
          return (
            <div
              key={node.id}
              className={`
                absolute flex flex-col node
                bg-gradient-to-br from-indigo-50 to-blue-50 
                border-2 border-blue-500 border-opacity-70 rounded-lg 
                shadow-md transition-all duration-200
                ${isSelected ? 'ring-4 ring-blue-400 z-10' : 'hover:ring-2 hover:ring-blue-300'}
              `}
              style={{ 
                left: `${node.x}px`, 
                top: `${node.y}px`,
                width: `${nodeWidth}px`,
                height: `${nodeHeight}px`
              }}
              onMouseMove={(e) => {
                const area = checkHoverArea(e, node);
                setHoverState({ nodeId: node.id, area });
              }}
              onMouseEnter={() => setHoverState({ nodeId: node.id, area: 'content' })}
              onMouseLeave={() => setHoverState({ nodeId: null, area: null })}
              onMouseDown={(e) => startNodeDrag(e, node.id)}
              onClick={() => setSelectedNodeId(node.id)}
            >
              <textarea
                className={`
                  flex-grow w-full bg-transparent border-none 
                  focus:outline-none px-3 py-2 resize-none
                  text-indigo-800 font-medium
                  placeholder-indigo-300
                  ${hoverState.area === 'resize' ? 'cursor-nwse-resize' : 'cursor-move'}
                `}
                value={node.text}
                onChange={(e) => updateNodeText(node.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="输入内容..."
                style={{ minHeight: '2rem' }}
              />
              
              {/* 调整大小指示器 */}
              {(isHovered || isSelected) && hoverState.area === 'resize' && (
                <div 
                  className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-blue-500"
                />
              )}
            </div>
          );
        })}

        {/* 添加节点按钮 */}
        <button
          className="
            fixed top-4 right-4 px-4 py-2 
            bg-gradient-to-r from-indigo-600 to-purple-600 
            text-white rounded-lg shadow-lg 
            hover:from-indigo-700 hover:to-purple-700 
            focus:outline-none z-10 
            transition-all duration-300 
            font-medium
          "
          onClick={addNode}
        >
          {selectedNodeId ? '添加子节点' : '添加节点'}
        </button>
      </div>
    </div>
  );
};

export default Canvas;