# CLAUDE.md

## 常用开发命令

* **构建与运行开发服务器**:
  `npm run dev` (启动本地 Vite 开发服务器，地址：http://localhost:5173)
* **安装依赖**:
  `npm install` (首次安装项目依赖)
* **运行测试**:
  `npm test` (运行 ultraman-magic-book/tests 目录下的 Jest 测试)
  `npm run test:useMagicBook` (运行魔法书组件的特定测试)
* **代码检查**:
  `npm run lint` (运行 ESLint 代码检查)

## 项目架构概览

这是一个基于 React + Vite + TypeScript 的前端应用，结构如下：

1. **核心结构**:
   - `ultraman-magic-book/` 项目主目录（子目录）
   - `design/` 包含 HTML/CSS 模板
   - `dist/` 构建文件输出目录
   - `src/` TypeScript 源代码目录

2. **关键模块**:
   - **数据/内容**: 奥特曼角色数据（1966-2024）
   - **UI 组件**: PageFlip、MagicBook、usePageFlip 钩子
   - **测试套件**: Jest 测试位于 `ultraman-magic-book/tests/` 目录

3. **工具链**:
   - Vite：构建配置
   - Jest：测试框架
   - Playwright：自动化测试

## 开发指南

1. 开发时请始终运行 `npm run dev` 启动本地开发服务器
2. 使用 `npm test` 运行完整测试套件
3. 提交前请使用 `npm run lint` 进行代码检查
4. 组件更改请使用特定测试命令进行验证（如 `npm run test:useMagicBook`）
