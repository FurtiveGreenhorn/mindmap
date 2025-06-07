import React from 'react';

const CanvasControls = ({ onAddNode, selectedNodeId }) => {
  return (
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
      onClick={onAddNode}
    >
      {selectedNodeId ? '添加子節點' : '添加節點'}
    </button>
  );
};

export default CanvasControls;