# 命名规范

在 React 生态中，命名规范遵循社区约定和官方推荐的最佳实践。以下是不同场景下的命名规则总结：

---

### **1. 组件命名（核心规则）**
| 类型                 | 规范         | 示例                     | 说明                                                                 |
|----------------------|--------------|--------------------------|----------------------------------------------------------------------|
| **组件文件名**        | 大驼峰       | `ShapeList.jsx`          | React 官方推荐，区分普通 JS 文件                                     |
| **组件类/函数名**     | 大驼峰       | `class ShapeList` 或 `const ShapeList = () => {}` | 必须大写开头，与 HTML 原生标签（如 `<div>`）区分 |
| **组件变量引用**      | 大驼峰       | `const MyComponent = <ShapeList />` | 无论是否复用，保持大驼峰                                             |

---

### **2. 非组件代码命名**
| 类型                 | 规范         | 示例                     | 说明                                                                 |
|----------------------|--------------|--------------------------|----------------------------------------------------------------------|
| **工具函数/工具类**   | 小驼峰       | `formatData`, `apiUtils` | 与普通 JavaScript 函数一致                                           |
| **自定义 Hook**       | 小驼峰 + `use` 前缀 | `useDataFetch`          | React 强制约定，必须以 `use` 开头                                     |
| **常量/配置**         | 全大写 + 下划线 | `MAX_COUNT`, `API_ENDPOINT` | 仅限全局常量，非组件内变量                                           |

---

### **3. 目录结构命名**
| 类型                 | 规范         | 示例                     | 说明                                                                 |
|----------------------|--------------|--------------------------|----------------------------------------------------------------------|
| **组件目录**          | 小写 + 连字符 | `src/components/shape-list` | 更易读，与 URL 路径风格一致                                          |
| **页面目录**          | 小写 + 连字符 | `src/pages/user-profile` | Next.js 等框架常见实践                                               |
| **工具目录**          | 小写 + 连字符 | `src/utils/date-format`  | 非 React 专属代码                                                    |

---

### **4. 例外情况**
• **第三方组件库**：若组件库自身使用小写（如 `antd` 的 `<button />`），保持原名直接使用。
• **项目历史遗留代码**：如果已有代码风格不一致（如 `shape_list.jsx`），建议逐步重构，而非强制修改。

---

### **对比示例**
```jsx
// ✅ 正确命名
import ShapeList from './components/ShapeList'; // 文件名大驼峰
const UserProfile = () => { /* ... */ };         // 组件函数大驼峰
const apiUtils = { fetchData() {} };             // 工具函数小驼峰

// ❌ 错误命名
import shapelist from './components/shapelist';  // 文件名小写
const userProfile = () => { /* ... */ };         // 组件函数小驼峰
const APIUtils = { fetchData() {} };             // 工具类大驼峰（易被误认为组件）
```

---

### **5. 自动检测工具**
• 使用 ESLint 规则 [`react/jsx-pascal-case`](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md) 强制组件命名规范。
• 配置示例：
  ```json
  {
    "rules": {
      "react/jsx-pascal-case": ["error", { "allowAllCaps": true }]
    }
  }
  ```

---

### **总结**
• **组件**：大驼峰（`PascalCase`）一切（文件名、函数名、类名、变量引用）。
• **非组件**：小驼峰（`camelCase`）或全大写常量。
• **目录**：小写 + 连字符（`kebab-case`）。
• **核心原则**：保持团队一致性 > 严格遵循规范。