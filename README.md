# Ultraman 奥特曼项目集合

本仓库包含 Ultraman 相关的项目集合。

## 项目列表

### Ultraman Magic Book (奥特曼魔法书)

为4岁男孩创建的纯前端奥特曼交互系统，按时间顺序展示31个奥特曼（1966-2024），古典魔法书形式呈现。

**技术栈**: React + Vite + TypeScript

**启动方式**:
```bash
cd ultraman-magic-book
npm install
npm run dev
```
访问：http://localhost:5173/

**功能**:
- 31个奥特曼完整数据（1966-2024）
- 古典魔法书UI风格
- 左页：奥特曼图片
- 右页：信息展示（简介/形态/技能/人间体/台词）
- 形态切换
- 翻页方式：按钮点击 + 手势滑动

## 目录结构

```
Ultraman/
├── ultraman-magic-book/   # 奥特曼魔法书 Web 应用
├── .sisyphus/             # 智能体工作区
├── docs/                  # 文档
└── .github/               # GitHub 配置
```

## 开发指南

详见各子项目目录下的 README.md