# .gitignore 文件统一设计方案

**日期**: 2026-04-30
**主题**: 统一根目录与 ultraman-magic-book 子目录的 .gitignore 文件

---

## 背景

当前存在两个 `.gitignore` 文件：
- `./.gitignore` (8行，根目录)
- `ultraman-magic-book/.gitignore` (28行，子目录)

`ultraman-magic-book` 是主仓库内的子目录（并非独立仓库或 submodule），根目录的 `.gitignore` 规则自动应用于所有子目录。

---

## 问题

1. 冗余：子目录 `.gitignore` 中的规则大部分已被根目录覆盖
2. 缺失：根目录缺少 Vite/编辑器相关的忽略规则
3. 不一致：两个文件内容不统一

---

## 解决方案

### 1. 更新根目录 `.gitignore`

添加所有适用的规则：

```gitignore
# Logs
logs/
*.log

# Dependencies
node_modules/

# Build output
dist/
dist-ssr/

# Local env files
*.local
coverage/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Playwright
playwright-report/
test-results/
.playwright-mcp/

# Git
.worktrees/
```

### 2. 删除子目录 `.gitignore`

由于整个仓库仅包含 `ultraman-magic-book` 这单一项目，无子目录特定规则需要保留。

---

## 验收标准

> 注：本设计方案对应的工作已在提交 `b92d1ea` 中完成。

1. [ ] 根目录 `.gitignore` 包含所有必要的全局规则
2. [ ] 子目录 `.gitignore` 已删除或已清空
3. [ ] `git status` 无误报文件
4. [ ] Vite 构建产物 (`dist/`, `coverage/`) 被正确忽略
5. [ ] 编辑器临时文件 (`.vscode/`, `.idea/`) 被正确忽略