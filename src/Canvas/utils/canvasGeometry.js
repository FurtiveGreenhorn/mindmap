// 獲取節點四條邊的中點
export const getNodeEdgeMidpoints = (node) => {
  const width = node.width || 160;
  const height = node.height || 60;
  return {
    top: { x: node.x + width / 2, y: node.y },
    right: { x: node.x + width, y: node.y + height / 2 },
    bottom: { x: node.x + width / 2, y: node.y + height },
    left: { x: node.x, y: node.y + height / 2 }
  };
};

// 計算兩點間距離
export const distance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

// 找到兩個節點最近邊的中點
export const findClosestMidpoints = (node1, node2) => {
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
  
  // 找到距離最小的點對
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