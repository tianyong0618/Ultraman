# 代码结构优化 - 变更提案

## 1. 变更概述

| 项目 | 内容 |
|------|------|
| 变更编号 | CP-2026-04-20-001 |
| 变更日期 | 2026-04-20 |
| 申请人 | - |
| 优先级 | P1 |
| 影响范围 | 全部源代码 |

### 1.1 变更背景

当前 `ultraman-magic-book/src/App.jsx` 文件包含 201 行代码，将所有逻辑（状态管理、渲染、事件处理）集中在一个文件中。这种结构导致：
- 代码难以维护和扩展
- 组件难以复用
- 状态逻辑与视图逻辑耦合
- 测试困难

### 1.2 变更目的

1. **组件拆分**：提高代码可维护性和可复用性
2. **数据管理**：将数据与视图分离，便于维护
3. **性能优化**：提升应用响应速度和用户体验

### 1.3 影响范围

| 目录/文件 | 变更类型 |
|----------|---------|
| `src/App.jsx` | 重构 |
| `src/components/` | 新增 |
| `src/data/ultraman.js` | 新增 |
| `src/hooks/` | 新增 |
| `tests/` | 更新 |

---

## 2. 详细需求与验收标准

### 2.1 需求列表

| 序号 | 需求描述 | 验收条件 | 状态 |
|------|---------|---------|------|
| REQ-001 | 创建 BookCover 组件 | 组件独立渲染封面，功能与原 App.jsx 一致 | - |
| REQ-002 | 创建 BookPage 组件 | 组件独立渲染书页，支持翻页 | - |
| REQ-003 | 创建 UltramanInfo 组件 | 组件渲染右侧信息区，含 Tabs | - |
| REQ-004 | 创建 Navigation 组件 | 组件处理翻页按钮和指示器 | - |
| REQ-005 | 创建 FormButton 组件 | 组件渲染形态切换按钮 | - |
| REQ-006 | 创建 SkillButton 组件 | 组件渲染技能按钮 | - |
| REQ-007 | 数据外部化 | ultramanData 移至 src/data/ultraman.js | - |
| REQ-008 | 自定义 Hook | 创建 useMagicBook Hook 管理状态 | - |
| REQ-009 | 图片懒加载 | 使用 React.lazy 或 IntersectionObserver | - |
| REQ-010 | 组件 memo 优化 | 对静态组件使用 React.memo | - |

### 2.2 验收标准

- [ ] 所有组件独立渲染，功能与原 App.jsx 一致
- [ ] 翻页、Tab 切换、形态切换功能正常
- [ ] 技能按钮和音效开关正常
- [ ] 数据完全外部化到 data/ultraman.js
- [ ] 35 个单元测试全部通过
- [ ] 6 个 E2E 测试全部通过
- [ ] 测试覆盖率不低于当前水平 (Statements: 46.66%)

---

## 3. 技术方案设计

### 3.1 实现思路

```
src/
├── components/
│   ├── BookCover/         # 封面组件
│   │   └── BookCover.jsx
│   ├── BookPage/          # 书页组件
│   │   ├── BookPage.jsx
│   │   ├── PageLeft.jsx   # 左页（图像）
│   │   └── PageRight.jsx  # 右页（信息）
│   ├── UltramanInfo/      # 信息区组件
│   │   ├── InfoTabs.jsx
│   │   └── InfoContent.jsx
│   ├── Navigation/        # 导航组件
│   │   └── Navigation.jsx
│   ├── FormButton/       # 形态按钮
│   │   └── FormButton.jsx
│   └── SkillButton/      # 技能按钮
│       └── SkillButton.jsx
├── data/
│   └── ultraman.js       # 奥特曼数据
├── hooks/
│   └── useMagicBook.js   # 状态管理 Hook
├── App.jsx               # 主入口（精简）
└── index.jsx             # 入口文件
```

### 3.2 关键修改点

| 文件 | 修改内容 |
|------|---------|
| App.jsx | 使用 components 组合，移除内联状态 |
| src/data/ultraman.js | 从 App.jsx 提取 ultramanData |
| src/hooks/useMagicBook.js | 新建 Hook 封装状态逻辑 |
| tests/ | 更新测试引用 |

### 3.3 风险与应对

| 风险 | 应对措施 |
|------|---------|
| 组件拆分导致 Props 传递过深 | 使用 Context 共享状态 |
| 测试失败 | 先更新测试，再重构代码（TDD） |
| 性能下降 | 使用 React.memo 优化 |

---

## 4. 测试计划

### 4.1 单元测试

| 测试用例 | 覆盖需求 | 状态 |
|---------|---------|------|
| BookCover 渲染测试 | REQ-001 | - |
| BookPage 翻页测试 | REQ-002 | - |
| UltramanInfo Tab 切换 | REQ-003 | - |
| Navigation 边界测试 | REQ-004 | - |
| useMagicBook 状态测试 | REQ-008 | - |

### 4.2 E2E 测试

| 测试用例 | 覆盖需求 | 状态 |
|---------|---------|------|
| 封面加载 | REQ-001 | - |
| 翻页功能 | REQ-002 | - |
| Tab 切换 | REQ-003 | - |
| 形态切换 | REQ-005 | - |
| 技能触发 | REQ-006 | - |

### 4.3 回归测试范围

- 全量 Vitest 测试 (`npm test`)
- 全量 Playwright E2E 测试 (`npx playwright test`)

---

## 5. 执行步骤与验收流程

### 5.1 执行步骤

1. **数据外部化**
   - 创建 `src/data/ultraman.js`
   - 迁移 ultramanData

2. **创建 Hook**
   - 创建 `src/hooks/useMagicBook.js`
   - 封装状态逻辑

3. **组件拆分**（按顺序）
   - BookCover 组件
   - SkillButton 组件
   - FormButton 组件
   - Navigation 组件
   - InfoTabs / InfoContent 组件
   - PageLeft / PageRight 组件
   - BookPage 组件

4. **主组件重构**
   - 重构 App.jsx 使用新组件

5. **性能优化**
   - 添加 React.memo
   - 实现图片懒加载

6. **测试更新**
   - 更新现有测试引用
   - 补充新组件测试

### 5.2 验收流程

```
创建分支 → 数据外部化 → 组件拆分 → 主组件重构 → 测试更新 → 全量测试 → 展示效果 → 用户验收 → 归档
```

---

## 6. 变更日志

| 日期 | 操作 | 负责人 | 说明 |
|------|------|--------|------|
| 2026-04-20 | 创建 | - | 初始提案 |
