# 奥特曼全家福功能设计

**版本**: 1.0
**日期**: 2026-04-23
**状态**: 已审批

---

## 1. 功能概述

| 项目 | 内容 |
|------|------|
| 功能名称 | 奥特曼全家福 (UltramanFamilyPortrait) |
| 功能类型 | 新功能开发 |
| 优先级 | P1 |

**核心功能**：
- 全屏星空背景 + 随机散落头像 + 关系光束连线
- 点击头像跳转书页
- 书页新增"关系"Tab，切换到关系模式时跳转全家福筛选视图

---

## 2. 交互流程

```
┌─────────────┐
│   封面页    │
└──────┬──────┘
       │ 点击"开启旅程"
       ▼
┌─────────────────────────┐
│     全家福页面           │
│  ┌─────────────────┐   │
���  │  全屏星空背景     │   │
│  │  ✦ ✦ ✦ 头像 ✦ ✦  │   │
│  │    光束连线       │   │
│  └─────────────────┘   │
└──────┬──────┘
       │ 点击头像
       ▼
┌─────────────────────────┐
│     书页                │
│  [形态][简介][人间体][关系] │
│  点击"关系" Tab         │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│  全家福页面（筛选模式）   │
│  相关头像：正常显示+高亮  │
│  无关头像：置灰           │
└─────────────────────────┘
```

---

## 3. 数据结构

### 3.1 关系定义

```typescript
interface UltramanRelation {
  id: number           // 奥特曼ID (1-29)
  relatedIds: number[] // 相关奥特曼ID列表
  relationType: string // 关系类型：brother | master | parallel | parent
}

// 奥特兄弟关系（单向：初代→赛文→杰克→艾斯→泰罗）
{ id: 1, relatedIds: [2], relationType: 'brother' },   // 初代
{ id: 2, relatedIds: [3], relationType: 'brother' },   // 赛文
{ id: 3, relatedIds: [4], relationType: 'brother' },   // 杰克
{ id: 4, relatedIds: [5], relationType: 'brother' },   // 艾斯
{ id: 5, relatedIds: [], relationType: 'brother' },     // 泰罗（末端）

// 师徒关系
{ id: 6, relatedIds: [2], relationType: 'master' },     // 雷欧←赛文
{ id: 24, relatedIds: [5], relationType: 'master' },   // 泰迦←泰罗

// 平成三杰
{ id: 11, relatedIds: [12, 13], relationType: 'parallel' }, // 迪迦
{ id: 12, relatedIds: [11, 13], relationType: 'parallel' }, // 戴拿
{ id: 13, relatedIds: [11, 12], relationType: 'parallel' }, // 盖亚

// 新生代核心关系
{ id: 19, relatedIds: [22], relationType: 'parent' },      // 银河S
{ id: 22, relatedIds: [2], relationType: 'parent' },       // 捷德（赛文之子）
{ id: 25, relatedIds: [24], relationType: 'master' },       // 泽塔←泰迦
```

### 3.2 状态管理

```typescript
// App.jsx 新增状态
const [selectedUltramanId, setSelectedUltramanId] = useState(null) // 选中的奥特曼ID（关系筛选用）
const [isRelationMode, setIsRelationMode] = useState(false)        // 是否为关系筛选模式
```

### 3.3 infoLabels 更新

```typescript
// 变更前
const infoLabels = ['形态', '简介', '人间体', '台词']

// 变更后
const infoLabels = ['形态', '简介', '人间体', '关系']
```

---

## 4. 视觉设计

### 4.1 全家福页面

| 元素 | 样式 |
|------|------|
| 背景 | 全屏星空动画（CSS动画模拟闪烁星星） |
| 头像 | 圆形小头像 (48x48px)，随机位置分布，间距不小于100px |
| 光束连线 | SVG line，颜色渐变（头像主色调），带发光效果 |
| 筛选模式 | 无关头像 opacity: 0.3，grayscale: 100% |
| 选中头像 | 添加金色边框 (box-shadow: 0 0 12px gold) |

### 4.2 星空背景 CSS

```css
.starfield {
  position: fixed;
  inset: 0;
  background: linear-gradient(to bottom, #0a0a1a, #1a1a3a);
  overflow: hidden;
}

.starfield::before,
.starfield::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  animation: twinkle 3s infinite;
}
```

---

## 5. 验收标准

| REQ | 描述 | 验收条件 |
|-----|------|----------|
| REQ-001 | 全屏星空背景 | 启动后全屏显示，星星闪烁动画 |
| REQ-002 | 头像随机分布 | 29个头像随机分布，不重叠 |
| REQ-003 | 关系连线显示 | 相关奥特曼之间显示光束连线 |
| REQ-004 | 点击跳转书页 | 点击头像跳转到对应页 |
| REQ-005 | 关系Tab显示 | Tab栏显示"关系"按钮 |
| REQ-006 | 筛选模式 | 点击"关系"后进入筛选模式 |
| REQ-007 | 头像置灰 | 无关头像置灰显示 |
| REQ-008 | 选中高亮 | 相关且被选中的头像高亮 |

---

## 6. 技术实现

| 文件 | 修改 |
|------|------|
| `src/components/BookCover.jsx` | 点击后跳转到全家福而非书页 |
| `src/App.jsx` | 新增全家福组件渲染、状态管理 |
| `src/components/FamilyPortrait.jsx` | **新增**：全家福页面组件 |
| `src/data/ultraman.js` | 新增 relations 关系数据 |
| `src/index.css` | 新增星空背景样式、全家福样式 |

---

## 7. 变更日志

| 日期 | 操作 | 负责人 | 说明 |
|------|------|--------|------|
| 2026-04-23 | 设计 | 田勇 | 初始版本，已审批 |

---

**文档结束**