# Canvas組件重構計劃

## 目錄結構
```
src/components/Canvas/
├── components/
│   ├── Node.jsx
│   ├── ConnectionsLayer.jsx
│   └── CanvasControls.jsx
├── hooks/
│   ├── useCanvasState.js
│   ├── useDragHandlers.js
│   ├── useResizeHandlers.js
│   └── useHoverDetection.js
├── utils/
│   └── canvasGeometry.js
└── Canvas.jsx
```

## 文件職責說明
1. **Node.jsx**
   - 單個節點渲染
   - 包含節點UI和文本編輯

2. **ConnectionsLayer.jsx**
   - SVG連接線渲染
   - 箭頭標記定義

3. **CanvasControls.jsx**
   - "添加節點"按鈕組件

4. **useCanvasState.js**
   - 管理nodes/connections狀態
   - 節點添加/更新方法

5. **useDragHandlers.js**
   - 節點和畫布拖拽邏輯
   - 拖拽偏移量計算

6. **useResizeHandlers.js**
   - 節點縮放邏輯
   - 縮放狀態管理

7. **useHoverDetection.js**
   - 懸停區域檢測
   - 懸停狀態管理

8. **canvasGeometry.js**
   - 節點邊緣中點計算
   - 距離計算
   - 最近點對查找

9. **Canvas.jsx**
   - 主組件入口
   - 整合所有子模塊
   - 畫布容器定義

## 驗證計劃
1. 節點操作測試
   - 創建/刪除節點
   - 拖拽移動節點
   - 調整節點大小

2. 連接線驗證
   - 自動計算最近連接點
   - 箭頭渲染正確性

3. 畫布操作
   - 整體拖拽畫布
   - 視窗縮放適配

4. 邊界條件
   - 空狀態處理
   - 窗口大小變化響應