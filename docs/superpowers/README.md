# 文档规范说明

**版本**: 1.0.0  
**日期**: 2026-04-21  
**项目**: Ultraman Magic Book

---

## 1. 概述

本文档定义 Ultraman Magic Book 项目开发过程中产生的文档规范。

遵循 OMO (OhMyOpenCode) 标准开发流程，所有需求开发统一使用以下技能组合：

```
brainstorming → writing-plans → executing-plans → verification-before-completion → finishing-a-development-branch
```

---

## 2. 文档目录结构

```
docs/superpowers/
├── specs/                          ← 规格文档（唯一基准）
│   ├── 2026-04-20-ultraman-magic-book-srs.md    ← 主规格文档
│   └── changes/                   ← 历史变更记录（已归档）
│       ├── 2026-04-20-代码结构优化.md
│       ├── 2026-04-20-设计系统.md
│       └── ...
├── plans/                          ← 实现计划（执行时生成）
│   └── 2026-04-21-技能展示调整.md
└── skills/                         ← 技能定义
    └── ARCHIVED-xxx.md            ← 已归档的技能
```

---

## 3. 文档类型定义

| 类型 | 说明 | 存放位置 |
|------|------|---------|
| **主规格 (SRS)** | 项目唯一的需求规格基准 | `specs/*.md` |
| **历史变更** | 已完成的需求变更记录 | `specs/changes/*.md` |
| **实现计划** | 开发执行计划（OMO 标准） | `plans/*.md` |
| **技能定义** | 工作流技能 | `skills/*.md` |

---

## 4. 命名规则

### 4.1 主规格文档

- 格式：`{日期}-{项目名}-srs.md`
- 示例：`2026-04-20-ultraman-magic-book-srs.md`

### 4.2 历史变更记录

- 格式：`{日期}-{变更名称}.md`（OMO 标准：`YYYY-MM-DD-<feature-name>.md`）
- 示例：`2026-04-20-代码结构优化.md`

### 4.3 实现计划

- 格式：`{日期}-{功能名}.md`
- 示例：`2026-04-21-技能展示调整.md`

---

## 5. OMO 标准开发流程

```
用户需求
   ↓
[加载 routing skill] ← 必先加载
   ↓
brainstorming（需求分析）
   ↓
writing-plans（编写计划）
   ↓
executing-plans（执行计划）
   ↓
verification-before-completion（验证）
   ↓
finishing-a-development-branch（完成分支）
```

### 技能职责

| 技能 | 职责 | 产出 |
|------|------|------|
| `routing` | 意图分类，路由到对应技能 | 技能加载决策 |
| `brainstorming` | 探索用户意图、需求细节 | 需求分析结果 |
| `writing-plans` | 生成可执行的计划文档 | `plans/*.md` |
| `executing-plans` | 按计划执行，任务管理 | 代码实现 |
| `verification-before-completion` | 验证通过后再交付 | 验证报告 |
| `finishing-a-development-branch` | 决定如何合并/清理 | 分支完成 |

---

## 6. 已归档文档清单

### 6.1 已归档的规格文档

| 文件 | 归档原因 |
|------|---------|
| `ARCHIVED-2026-04-16-ultraman-magic-book-design.md` | 被 srs.md 替代 |

### 6.2 已归档的技能

| 文件 | 归档原因 |
|------|---------|
| `ARCHIVED-change-request.md` | 功能已被 OMO 标准技能覆盖 |

### 6.3 已归档的计划

| 文件 | 归档原因 |
|------|---------|
| `plans/ARCHIVED-2026-04-21-技能展示调整.md` | 已执行完成 |

---

## 7. 禁止事项

| 禁止 | 说明 |
|------|------|
| 禁止跳过 routing | 任何需求必须先加载 routing skill |
| 禁止跳过 brainstorming | 任何需求必须先进行需求分析 |
| 禁止文档与代码脱节 | 主规格必须与代码实现保持一致 |
| 禁止创建重复规格 | 同一功能的规格只能有一个 |

---

## 8. 相关命令

| 命令 | 说明 |
|------|------|
| `npm test` | 运行 Vitest 单元测试 |
| `npx playwright test` | 运行 Playwright E2E 测试 |
| `npm run build` | 构建生产版本 |

---

**文档结束**