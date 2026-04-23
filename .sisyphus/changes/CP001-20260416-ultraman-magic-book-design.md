# Ultraman Interactive Encyclopedia - Design Specification

## 1. Project Overview

### Project Name
**Ultraman Magic Book (奥特曼魔法书)**

### Type
Interactive Encyclopedia Web Application for Children

### Core Functionality
A visually engaging, time-ordered encyclopedia of all Ultraman series presented as an ancient magical book. Children can browse through the book, view each Ultraman's details, switch between forms, and trigger special attacks with sound effects.

### Target Users
- Primary: 4-year-old boys
- Secondary: Parents

### Tech Stack
- React 18
- Vite (build tool)
- CSS Modules

---

## 2. UI/UX Specification

### 2.1 Layout Structure

#### Page Hierarchy (翻页魔法书)

```
┌─────────────────────────────────────┐
│           MagicBookApp               │
│  ┌─────────────────────────────┐   │
│  │      BookCover (封面)       │   │
│  │   "奥特曼魔法书"           │   │
│  │   [开始阅读] 按钮         │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   BookPages (翻页魔法书)    │   │
│  │   ┌─────────────────────┐   │   │
│  │   │  ← 上一页 |        │   │   │
│  │   │ ┌─────┐ ┌─────────┐ │   │   │
│  │   │ │图像 │ │ 信息   │ │   │   │
│  │   │ │     │ │        │ │   │   │
│  │   │ └─────┘ └─────────┘ │   │   │
│  │   │    下一页 →        │   │   │
│  │   └─────────────────────┘   │   │
│  │   (3D翻页动画效果)          │   │
│  │   每页1个，共31页           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   UltramanDetail (详情页)  │   │
│  │   ┌──────────────┐       │   │
│  │   │  图片区域   │       │   │
│  │   │  形态切换  │       │   │
│  │   └──────────────┘       │   │
│  │   ┌──────────────┐       │   │
│  │   │  信息卡片  │       │   │
│  │   │ 1-5内容   │       │   │
│  │   └──────────────┘       │   │
│  │   [技能按钮] [音效]      │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### Responsive Breakpoints

- **Mobile**: < 768px (单列卡片，触摸滑动)
- **Tablet**: 768px - 1024px (2列卡片)
- **Desktop**: > 1024px (3-4列卡片)

### 2.2 Visual Design

#### Color Palette

| Color Name | Hex Code | Usage |
|-----------|---------|-------|
| **Magic Black** | #1a0f0a | 主背景色 |
| **Ancient Gold** | #d4a84b | 金色边框，标题 |
| **Leather Brown** | #5c3d2e | 封面，标题背景 |
| **Parchment** | #f4e4c1 | 书页背景，卡片 |
| **Warm White** | #fffef5 | 文字背景 |
| **Ink Black** | #2c1810 | 主要文字 |
| **Crimson** | #8b2500 | 强调色，特效 |
| **Electric Blue** | #00d4ff | 发光效果 |
| **Flame Orange** | #ff6b00 | 技能特效 |

#### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| **主标题** | Cinzel (Google Fonts) | 48px | 700 |
| **章节标题** | Cinzel | 32px | 600 |
| **卡片标题** | Noto Sans SC | 18px | 600 |
| **正文** | Noto Sans SC | 16px | 400 |
| **说明文字** | Noto Sans SC | 14px | 400 |

#### Spacing System

- **Base unit**: 8px
- **Padding (小)**: 8px
- **Padding (中)**: 16px
- **Padding (大)**: 24px
- **Margin (组件间)**: 24px
- **Gap (卡片网格)**: 16px

#### Visual Effects

1. **魔法书封面**
   - 皮革纹理边框 (CSS pattern)
   - 金色烫金效果 (gradient)
   - 书脊阴影 (box-shadow)
   - 翻开动画 (transform + transition)

2. **页面翻页效果**
   - 3D翻页动画 (preserve-3d)
   - 页面边缘卷曲效果

3. **卡片悬停效果**
   - 轻微放大 (scale: 1.02)
   - 金色光晕 (box-shadow glow)
   - 标题发光

4. **技能特效**
   - 能量聚集动画
   - 光线发射动画
   - 粒子效果

### 2.3 Components

#### BookCover (封面组件)
- 魔法书封面图案
- 标题 "奥特曼魔法书"
- "开始阅读" 按钮 (启动动画)
- 装饰性魔法符文

#### TableOfContents (目录组件)
- 分页显示的卡片网格
- 翻页导航 (上一页/下一页)
- 页面指示器 (当前页/总页数)

#### UltramanCard (奥特曼卡片)
- 卡片缩略图
- 名称 (中文/日文/英文)
- 年份标签
- 悬停预览效果

#### UltramanDetail (详情组件)
- 大图展示区
- 形态切换按钮
- 信息标签页 (5个Tab)
- 技能释放按钮
- 音效开关

#### SkillButton (技能按钮)
- 技能图标
- 技能名称
- 点击动画 (能量释放)
- 音效触发

---

## 3. Functionality Specification

### 3.1 Core Features

#### F1: 魔法书系统
- 封面 → 目录 → 详情页的导航
- 翻页动画
- 书页边缘卷曲效果
- 响应式布局

#### F2: 目录浏览
- 按时间顺序显示所有奥特曼
- 分页 (每页6-12个)
- 卡片网格展示
- 快速跳转

#### F3: 详情展示
- 大图展示
- 形态切换 (有多个形态的)
- 5类信息展示

#### F4: 技能释放
- 点击按钮释放技能动画
- 语音/音效播放
- 特效动画

#### F5: 音效系统
- 背景音乐开关
- 技能音效
- 翻页音效

### 3.2 数据结构

```typescript
interface Ultraman {
  id: string;
  name: {
    cn: string;      // 中文名
    jp: string;     // 日文名
    en: string;     // 英文名
  };
  year: number;      // 首次登场年份
  series: string;   // 作品名称
  description: string; // 剧情简介
  forms: Form[];   // 形态列表
  skills: Skill[]; // 技能列表
  catchphrase: string; // 经典台词
  image: string;   // 主图片URL
 人间体?: string;    // 人间体
}

interface Form {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface Skill {
  id: string;
  name: string;
  description: string;
  effect: 'beam' | 'explosion' | 'slash';
  soundUrl: string;
}
```

### 3.3 交互流程

```
用户进入
    ↓
显示封面 [动画效果]
    ↓
点击 "开始阅读"
    ↓
显示目录 (第1页)
    ↓
点击任意卡片
    ↓
显示详情页
    ↓
[形态切换] / [技能释放] / [返回目录]
```

### 3.4 边界情况处理

1. **图片加载失败**: 显示占位图 + 错误提示
2. **音效加载失败**: 静默失败，不阻塞
3. **数据缺失**: 显示"待补充"占位符
4. **移动端触摸**: 支持滑动翻页
5. **网络离线**: 显示缓存内容 (如已加载)

---

## 4. 数据内容

### 31个奥特曼完整列表 (按时间顺序)

| 序号 | 年份 | 作品名称 | 时期分类 | 简要说明 |
|------|------|----------|----------|----------|
| 1 | 1966 | 奥特Q | 昭和时期 | 特摄试水作，无巨大英雄 |
| 2 | 1966 | 初代奥特曼 | 昭和时期 | 奥特曼系列开山之作 |
| 3 | 1967 | 赛文奥特曼 | 昭和时期 | 最初为独立作品，后纳入系列 |
| 4 | 1971 | 杰克奥特曼 | 昭和时期 | 原名《归来的奥特曼》 |
| 5 | 1972 | 艾斯奥特曼 | 昭和时期 | 首次出现双人合体变身 |
| 6 | 1973 | 泰罗奥特曼 | 昭和时期 | 圆谷建社10周年纪念作 |
| 7 | 1974 | 雷欧奥特曼 | 昭和时期 | 首次非M78星云战士 |
| 8 | 1979 | 乔尼亚斯奥特曼 | 昭和时期 | 首部动画版奥特曼 |
| 9 | 1980 | 爱迪奥特曼 | 昭和时期 | 昭和系列最后一部TV作品 |
| 10 | 1989 | 奥特曼（USA） | 昭和海外 | 美国制作 |
| 11 | 1990 | 葛雷奥特曼 | 昭和海外 | 澳大利亚制作 |
| 12 | 1993 | 帕瓦特奥特曼 | 昭和海外 | 美国制作 |
| 13 | 1996 | 迪迦奥特曼 | 平成时期 | 奥特曼30周年纪念作，开启平成时代 |
| 14 | 1997 | 戴拿奥特曼 | 平成时期 | 迪迦的续作 |
| 15 | 1998 | 盖亚奥特曼 | 平成时期 | 与阿古茹奥特曼双主角 |
| 16 | 2001 | 高斯奥特曼 | 平成时期 | 强调和平共处理念 |
| 17 | 2004 | 奈克瑟斯奥特曼 | 平成时期 | 风格较黑暗的成人向作品 |
| 18 | 2005 | 麦克斯奥特曼 | 平成时期 | 回归传统风格 |
| 19 | 2006 | 梦比优斯奥特曼 | 平成时期 | 奥特曼40周年纪念作 |
| 20 | 2013 | 银河奥特曼 | 新生代（平成） | 新生代开端 |
| 21 | 2014 | 银河奥特曼S | 新生代（平成） | 银河的续作 |
| 22 | 2015 | 艾克斯奥特曼 | 新生代（平成） | 融合数码科技元素 |
| 23 | 2016 | 欧布奥特曼 | 新生代（平成） | 可使用前辈力量的融合战士 |
| 24 | 2017 | 捷德奥特曼 | 新生代（平成） | 贝利亚之子 |
| 25 | 2018 | 罗布奥特曼 | 新生代（平成） | 兄弟二人变身 |
| 26 | 2019 | 泰迦奥特曼 | 新生代（令和） | 泰罗之子，令和首作 |
| 27 | 2020 | 泽塔奥特曼 | 新生代（令捏） | 赛罗弟子 |
| 28 | 2021 | 特利迦奥特曼 | 新生代（令和） | 迪迦精神续作 |
| 29 | 2022 | 德凯奥特曼 | 新生代（令捏） | 特利迦续作 |
| 30 | 2023 | 布莱泽奥特曼 | 新生代（令和） | 原始野性风格 |
| 31 | 2024 | 亚刻奥特曼 | 新生代（令捏） | 最新作品 |

**翻页设置**：
- **每页1个奥特曼**：
  - 左页：2D图像
  - 右页：信息（5类）
- 共31页
- 3D翻页动画效果

---

## 5. 验收标准

### 视觉验收
- [ ] 封面显示古典魔法书风格，金色边框
- [ ] 目录页按时间顺序显示卡片网格
- [ ] 详情页显示5类信息
- [ ] 形态切换按钮正常工作
- [ ] 技能释放动画流畅
- [ ] 响应式布局适配手机/平板/桌面

### 功能验收
- [ ] 所有28个奥特曼数据完整
- [ ] 翻页功能正常
- [ ] 形态切换功能正常
- [ ] 技能释放功能正常
- [ ] 音效播放功能正常
- [ ] 返回导航正常

### 性能验收
- [ ] 首屏加载 < 3秒
- [ ] 动画流畅 (60fps)
- [ ] 图片懒加载

---

## 6. 技术实现

### 项目结构

```
ultraman-magic-book/
├── public/
│   ├── images/          # 图片资源
│   │   └── ultraman/    # 各奥特曼图片
│   └── sounds/          # 音效资源
├── src/
│   ├── components/      # React组件
│   │   ├── BookCover/
│   │   ├── TableOfContents/
│   │   ├── UltramanCard/
│   │   ├── UltramanDetail/
│   │   └── SkillButton/
│   ├── data/           # 数据
│   │   └── ultraman.json
│   ├── styles/         # 样式
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── package.json
```

### 依赖
- react: ^18.2.0
- react-dom: ^18.2.0
- vite: ^5.0.0