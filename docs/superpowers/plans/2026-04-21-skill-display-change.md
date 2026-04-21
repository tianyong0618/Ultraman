# 技能展示调整实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 去掉"技能"标签页，将技能展示区改为显示所有技能并点击播放对应音频

**Architecture:** 修改标签顺序为[简介, 人间体, 台词, 形态]，技能展示区渲染全部技能，每个技能按钮点击播放独立音频

**Tech Stack:** React + Vite

---

### Task 1: 修改 infoLabels 数据

**Files:**
- Modify: `ultraman-magic-book/src/data/ultraman.js:33`

- [ ] **Step 1: 修改 infoLabels**

```javascript
// 当前
export const infoLabels = ['简介', '形态', '技能', '人间体', '台词']

// 修改为
export const infoLabels = ['简介', '人间体', '台词', '形态']
```

- [ ] **Step 2: 验证诊断**

Run: `lsp_diagnostics ultraman-magic-book/src/data/ultraman.js`
Expected: 无error

- [ ] **Step 3: 提交**

```bash
git add src/data/ultraman.js
git commit -m "chore: 调整infoLabels顺序，去掉技能标签"
```

---

### Task 2: 修改 UltramanInfo 组件 - 标签和技能展示

**Files:**
- Modify: `ultraman-magic-book/src/components/UltramanInfo.jsx`

- [ ] **Step 1: 修改 TabContent - 移除技能标签页内容**

定位到 `TabContent` 组件（约第3-46行），修改渲染逻辑：

```javascript
const TabContent = memo(function TabContent({ activeTab, current }) {
  return (
    <>
      {activeTab === 0 && (
        <p className="info-text" id="tabpanel-0" role="tabpanel">
          {current.desc}
        </p>
      )}
      {activeTab === 1 && (
        <p className="info-text" id="tabpanel-1" role="tabpanel">
          {current.human || '待补充'}
        </p>
      )}
      {activeTab === 2 && (
        <p className="info-text" id="tabpanel-2" role="tabpanel" style={{ fontStyle: 'italic' }}>
          "{current.catchphrase}"
        </p>
      )}
      {activeTab === 3 && (
        <div className="forms-list" role="group" aria-label="形态选择">
          {current.forms.length > 0 ? (
            current.forms.map((form, idx) => (
              <button
                key={form}
                className="form-button"
                aria-pressed={activeTab === 3}
              >
                {form}
              </button>
            ))
          ) : (
            <p className="info-text">无多种形态</p>
          )}
        </div>
      )}
    </>
  )
})
```

- [ ] **Step 2: 修改 playTabAudio 类型映射**

定位到 `playTabAudio` 使用处（约第73-79行），更新 typeMap：

```javascript
// 当前：const typeMap = ['desc', 'forms', 'skills', 'human', 'catchphrase']
// 修改为：
const typeMap = ['desc', 'human', 'catchphrase', 'forms']
```

- [ ] **Step 3: 修改技能展示区 - 渲染全部技能**

定位到技能展示区（约第86-95行）：

```javascript
<div className="skills-section">
  <p className="skills-title">技能展示</p>
  <div className="skills-list">
    {current.skills.length > 0 ? (
      current.skills.map((skill, idx) => (
        <button
          key={skill}
          className="skill-button"
          onClick={() => onPlaySkill && onPlaySkill(idx)}
          aria-label={`播放技能: ${skill}`}
        >
          ⚡ {skill}
        </button>
      ))
    ) : (
      <p className="info-text">无技能数据</p>
    )}
  </div>
</div>
```

- [ ] **Step 4: 运行诊断**

Run: `lsp_diagnostics ultraman-magic-book/src/components/UltramanInfo.jsx`
Expected: 无error

- [ ] **Step 5: 提交**

```bash
git add src/components/UltramanInfo.jsx
git commit -m "feat: 技能展示显示全部技能，移除技能标签页"
```

---

### Task 3: 修改 useMagicBook - 播放技能音频

**Files:**
- Modify: `ultraman-magic-book/src/hooks/useMagicBook.js`

- [ ] **Step 1: 添加音频文件清理函数**

在文件顶部添加 sanitizeSkillName 函数：

```javascript
const sanitizeSkillName = (name) => name.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_')
```

- [ ] **Step 2: 修改 playSkill 函数**

定位到 playSkill 函数（约第82-89行）：

```javascript
const playSkill = useCallback((skillIndex) => {
  if (!soundOn || !current) return
  const skillName = current.skills[skillIndex]
  if (skillName) {
    const safeUltramanName = sanitizeFilename(current.name)
    const safeSkillName = sanitizeSkillName(skillName)
    const audio = new Audio(`/audio/skills/${safeUltramanName}_${safeSkillName}.mp3`)
    audio.play().catch(() => {})
  }
}, [soundOn, current])
```

- [ ] **Step 3: 诊断验证**

Run: `lsp_diagnostics ultraman-magic-book/src/hooks/useMagicBook.js`
Expected: 无error

- [ ] **Step 4: 提交**

```bash
git add src/hooks/useMagicBook.js
git commit -m "feat: playSkill使用技能名称独立音频"
```

---

### Task 4: 样式调整（可选）

**Files:**
- Modify: `ultraman-magic-book/src/index.css`

- [ ] **Step 1: 添加技能列表样式**

如果需要，调整 `.skills-list` 样式：

```css
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
```

- [ ] **Step 2: 提交**

```bash
git add src/index.css
git commit -m "style: 技能列表布局调整"
```

---

### Task 5: 生成技能音频文件

**Files:**
- Create: `ultraman-magic-book/public/audio/skills/*.mp3` (~100个文件)

- [ ] **Step 1: 创建音频生成脚本**

创建 `generate-skill-audio.js`：

```javascript
// 使用 edge-tts 生成技能音频
// 命名规则: {奥特曼名称}_{技能名称}.mp3
// 输出目录: public/audio/skills/
```

- [ ] **Step 2: 运行脚本生成音频**

```bash
node generate-skill-audio.js
```

- [ ] **Step 3: 提交**

```bash
git add public/audio/skills/
git commit -m "feat: 添加技能音频文件"
```

---

### Task 6: 测试验证

- [ ] **Step 1: 启动开发服务器**

```bash
cd ultraman-magic-book && npm run dev
```

- [ ] **Step 2: 验证UI**
- 标签页显示4个（无"技能"标签）
- 技能展示区显示全部技能按钮
- 点击技能按钮播放音频

- [ ] **Step 3: 提交**

```bash
git commit -m "test: 验证技能展示功能"
```

---

## 验收标准

1. ✅ 标签页显示4个：[简介, 人间体, 台词, 形态]
2. ✅ 技能展示区显示该奥特曼全部技能（3-4个按钮）
3. ✅ 点击技能按钮播放对应音频
4. ✅ 翻页后正确重置状态
5. ✅ 诊断无error