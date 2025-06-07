import React, { useRef } from 'react';
import Node from './components/Node';
import ConnectionsLayer from './components/ConnectionsLayer';
import CanvasControls from './components/CanvasControls';
import useCanvasState from './hooks/useCanvasState';
import useDragHandlers from './hooks/useDragHandlers';
import useResizeHandlers from './hooks/useResizeHandlers';
import useHoverDetection from './hooks/useHoverDetection';

const Canvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // 狀態管理
  const {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    nodes,
    setNodes,
    connections,
    selectedNodeId,
    setSelectedNodeId,
    viewportSize,
    addNode,
    updateNodeText
  } = useCanvasState();
  
  // 拖拽處理
  const {
    startNodeDrag,
    startCanvasDrag,
    onDrag,
    endDrag,
    dragging,
    draggingCanvas
  } = useDragHandlers(canvasRef, nodes, selectedNodeId, setNodes, setSelectedNodeId);
  
  // 縮放處理
  const {
    startResize,
    handleResize,
    endResize,
    resizing
  } = useResizeHandlers(canvasRef, nodes, setNodes);
  
  // 懸停檢測
  const {
    hoverState,
    setHoverState,
    checkHoverArea
  } = useHoverDetection();
  
  // 組合事件處理
  const handleMouseMove = (e) => {
    onDrag(e);
    if (resizing) handleResize(e);
  };
  
  const handleMouseDown = (e, nodeId) => {
    const area = checkHoverArea(e, nodes.find(n => n.id === nodeId));
    setHoverState({ nodeId, area });
    
    if (area === 'resize') {
      startResize(e, nodeId);
    } else {
      startNodeDrag(e, nodeId);
    }
  };
  
  const handleEndDrag = () => {
    endDrag();
    endResize();
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
        onMouseMove={handleMouseMove}
        onMouseUp={handleEndDrag}
        onMouseLeave={handleEndDrag}
      >
        <ConnectionsLayer 
          connections={connections} 
          nodes={nodes}
          CANVAS_WIDTH={CANVAS_WIDTH}
          CANVAS_HEIGHT={CANVAS_HEIGHT}
        />
        
        {nodes.map(node => {
          const isSelected = selectedNodeId === node.id;
          return (
            <Node
              key={node.id}
              node={node}
              isSelected={isSelected}
              hoverState={hoverState}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              onTextChange={updateNodeText}
              onMouseMove={(e) => {
                const area = checkHoverArea(e, node);
                setHoverState({ nodeId: node.id, area });
              }}
              onMouseEnter={() => setHoverState({ nodeId: node.id, area: 'content' })}
              onMouseLeave={() => setHoverState({ nodeId: null, area: null })}
            />
          );
        })}
        
        <CanvasControls 
          onAddNode={addNode} 
          selectedNodeId={selectedNodeId} 
        />
      </div>
    </div>
  );
};

export default Canvas;