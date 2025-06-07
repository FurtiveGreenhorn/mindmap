import React from 'react';

const Node = ({ 
  node, 
  isSelected, 
  onMouseDown, 
  onTextChange,
  hoverState,
  onMouseMove,
  onMouseEnter,
  onMouseLeave
}) => {
  const nodeWidth = node.width || 160;
  const nodeHeight = node.height || 60;
  const isHovered = hoverState.nodeId === node.id;

  return (
    <div
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
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onClick={() => isSelected || onMouseDown({}, node.id)} // 點擊選中
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
        onChange={(e) => onTextChange(node.id, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        placeholder="輸入內容..."
        style={{ minHeight: '2rem' }}
      />
      
      {/* 調整大小指示器 */}
      {(isHovered || isSelected) && hoverState.area === 'resize' && (
        <div 
          className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-blue-500"
        />
      )}
    </div>
  );
};

export default Node;