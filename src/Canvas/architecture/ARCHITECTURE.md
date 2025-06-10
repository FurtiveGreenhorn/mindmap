# Canvas 元件架構思維導圖

## 整體架構
```mermaid
graph LR
    A[Canvas架構] --> B[基本交互]
    A --> C[視圖操作]
    A --> D[數據操作]
    A --> E[狀態反饋]
    A --> F[特殊功能]
    
    B --> B1[畫布拖拽 🟢]
    B --> B2[節點拖拽 🟢]
    B --> B3[節點縮放 🟢]
    B --> B4[節點選擇 🟢]
    
    C --> C1[添加節點 🟢]
    C --> C2[刪除節點 🔴]
    C --> C3[平移視圖 🟡]
    C --> C4[縮放視圖 🔴]
    
    D --> D1[編輯文本 🟢]
    D --> D2[創建連接 🔴]
    D --> D3[刪除連接 🔴]
    
    E --> E1[懸停提示 🟢]
    E --> E2[選中高亮 🟢]
    E --> E3[拖拽預覽 🟡]
    
    F --> F1[撤銷/重做 🔴]
    F --> F2[自動佈局 🔴]
```

## 功能狀態說明
| 狀態標記 | 含義          | 數量 |
|----------|---------------|------|
| 🟢       | 完整實現      | 8    |
| 🟡       | 部分實現      | 3    |
| 🔴       | 未實現        | 7    |

## 詳細狀態分佈
```mermaid
pie
    title 功能實現狀態分佈
    "完整實現" : 8
    "部分實現" : 3
    "未實現" : 7
```

## 後續開發路線圖
```mermaid
gantt
    title Canvas 功能開發路線圖
    dateFormat  YYYY-MM-DD
    section 核心功能
    連接系統           :a1, 2025-06-10, 7d
    視圖操作完善       :2025-06-15, 5d
    section 體驗優化
    拖拽預覽效果      :2025-06-20, 3d
    撤銷重做系統      :2025-06-25, 5d
    section 高級功能
    自動佈局算法      :2025-07-01, 10d
    視圖縮放         :2025-07-15, 5d
```

## 文件依賴關係
```mermaid
flowchart TD
    A[Canvas.jsx] --> B[useCanvasState.js]
    A --> C[useDragHandlers.js]
    A --> D[useResizeHandlers.js]
    A --> E[useHoverDetection.js]
    A --> F[Node.jsx]
    A --> G[ConnectionsLayer.jsx]
    A --> H[CanvasControls.jsx]
    
    B --> I[節點數據管理]
    C --> J[拖拽邏輯]
    D --> K[縮放邏輯]
    E --> L[懸停檢測]
    F --> M[節點渲染]
    G --> N[連接線繪製]
    H --> O[控制界面]
```