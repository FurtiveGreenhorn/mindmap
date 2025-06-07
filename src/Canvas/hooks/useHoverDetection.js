import { useState } from 'react';

const useHoverDetection = () => {
  const [hoverState, setHoverState] = useState({
    nodeId: null,
    area: null // 'content', 'resize'
  });

  // 檢測懸停區域
  const checkHoverArea = (e, node) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const threshold = 10;
    
    // 檢查是否在調整大小區域（右下角）
    if (x > rect.width - threshold && y > rect.height - threshold) {
      return 'resize';
    }
    return 'content';
  };

  return {
    hoverState,
    setHoverState,
    checkHoverArea
  };
};

export default useHoverDetection;