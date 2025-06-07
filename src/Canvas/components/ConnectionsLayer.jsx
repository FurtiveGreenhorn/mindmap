import React from 'react';
import { findClosestMidpoints } from '../utils/canvasGeometry';

const ConnectionsLayer = ({ connections, nodes, CANVAS_WIDTH, CANVAS_HEIGHT }) => {
  return (
    <svg 
      className="absolute top-0 left-0 pointer-events-none" 
      width={CANVAS_WIDTH} 
      height={CANVAS_HEIGHT}
    >
      {connections.map(conn => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);
        
        if (!fromNode || !toNode) return null;
        
        // 找到最近邊的中點作為連線端點
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
  );
};

export default ConnectionsLayer;