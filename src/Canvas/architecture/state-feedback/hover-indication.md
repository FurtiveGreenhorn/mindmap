# 懸停提示功能架構

## 功能描述
當用戶將鼠標懸停在節點不同區域時，提供視覺反饋（如游標變化、區域高亮）

## 核心文件
- [`useHoverDetection.js`](src/Canvas/hooks/useHoverDetection.js)
  - `checkHoverArea()`: 檢測鼠標在節點的哪個區域
  - `hoverState`: 存儲當前懸停狀態
- [`Node.jsx`](src/Canvas/components/Node.jsx)
  - 根據懸停狀態應用不同樣式
  - 設置不同區域的游標樣式

## 懸停區域分類
```mermaid
graph LR
    A[節點懸停區域] --> B[內容區]
    A --> C[縮放邊緣]
    A --> D[連接點]
```

## 交互流程
```mermaid
sequenceDiagram
    participant User
    participant NodeComponent
    participant useHoverDetection
    
    User->>NodeComponent: 鼠標移動到節點上
    NodeComponent->>useHoverDetection: 檢測懸停區域
    useHoverDetection-->>NodeComponent: 返回區域類型
    
    alt 內容區
        NodeComponent->>NodeComponent: 設置指針游標
    else 縮放邊緣
        NodeComponent->>NodeComponent: 設置縮放游標
    else 連接點
        NodeComponent->>NodeComponent: 設置連接游標
    end
```

## 實現機制
1. 實時檢測鼠標相對於節點的位置
2. 根據坐標判斷懸停區域
3. 更新懸停狀態觸發重新渲染
4. 根據區域類型應用不同視覺效果