# Vite + React + TypeScript 项目搭建指南
## 引用

- [命名规范](./doc/stadards.md)


## 步骤

以下是创建 **React + Vite + TypeScript** 项目的完整步骤（项目名 `excalidraw-demo-vite`）：


---

### 步骤 1: 初始化项目
使用 Vite 的 React+TS 模板创建项目：
```bash
npm create vite@latest excalidraw-demo-vite -- --template react-ts
cd excalidraw-demo-vite
```

---

### 步骤 2: 安装依赖
安装基础依赖：
```bash
npm install
# 或
yarn install
```

---

### 步骤 3: 清理默认文件
删除不必要的文件，保留以下结构：
```
excalidraw-demo-vite/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
└── tsconfig.json
```

删除以下文件：
• `src/assets/react.svg`
• `src/App.css`
• `src/index.css`

---

### 步骤 4: 修改代码
1. **修改 `src/App.tsx`**  
   编写一个简单计数器组件：
   ```tsx
   import { useState } from 'react';

   function App() {
     const [count, setCount] = useState<number>(0);

     return (
       <div className="container">
         <h1>Vite + React + TypeScript</h1>
         <button onClick={() => setCount(count + 1)}>
           Count: {count}
         </button>
       </div>
     );
   }

   export default App;
   ```

2. **修改 `src/main.tsx`**  
   清理 CSS 引用：
   ```tsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>
   );
   ```

---

### 步骤 5: 添加基础样式
创建 `src/styles.css`：
```css
body {
  margin: 0;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

button {
  padding: 10px 20px;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #535bf2;
}
```

在 `src/main.tsx` 中引入样式：
```tsx
import './styles.css';
```

---

### 步骤 6: 运行项目
启动开发服务器：
```bash
npm run dev
```
访问 `http://localhost:5173` 查看效果。

---

### 步骤 7: 添加 Excalidraw 组件（可选）
如果需要集成 Excalidraw：
```bash
npm install @excalidraw/excalidraw
```

修改 `App.tsx`：
```tsx
import { Excalidraw } from "@excalidraw/excalidraw";

function App() {
  return (
    <div style={{ height: "100vh" }}>
      <Excalidraw theme="dark" />
    </div>
  );
}
```

---

### 项目配置要点
1. **TypeScript 类型检查**  
   Vite 已自动生成 `vite-env.d.ts` 和 `tsconfig.json`，无需额外配置。

2. **路径别名**  
   在 `tsconfig.json` 中添加路径别名（可选）：
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["src/*"]
       }
     }
   }
   ```

---

### 生产构建
```bash
npm run build
npm run preview
```

---

### 常见问题
1. **浏览器兼容性**  
   Vite 默认支持现代浏览器，如需兼容旧版，可安装 `@vitejs/plugin-legacy`。

2. **类型报错处理**  
   若第三方库无类型定义，可在 `vite-env.d.ts` 中添加声明：
   ```ts
   declare module "some-untyped-library";
   ```

---

通过以上步骤，你已成功创建了一个现代化的 **Vite + React + TypeScript** 项目！后续可扩展路由、状态管理等能力。


## 版本问题
@excalidraw/excalidraw 包要求 React 版本是 ^17.0.2 或 ^18.2.0。


建议修改 package.json 中的 React 版本如下：

```json:package.json
{
  // ... existing code ...
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
  // ... existing code ...
}
```

修改完成后，请执行以下步骤：

1. 删除 node_modules 文件夹和 package-lock.json 文件：
```bash
rm -rf node_modules package-lock.json
```

2. 重新安装依赖：
```bash
npm install
```

3. 然后安装 Excalidraw：
```bash
npm install @excalidraw/excalidraw
```


