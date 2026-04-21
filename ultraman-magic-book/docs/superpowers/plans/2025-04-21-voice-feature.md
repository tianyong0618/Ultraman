# Voice Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为奥特曼魔法书添加语音朗读功能，默认开启，翻页时朗读奥特曼名称，点击各标签时朗读对应内容

**Architecture:** 使用 edge-TTS 免费工具生成音频文件，存储在 `public/audio/` 目录，通过 HTML5 Audio API 播放

**Tech Stack:** edge-tts (生成音频), HTML5 Audio API (播放)

---

## File Structure

```
public/audio/
 ├── name/
  │   ├── 1.mp3   # 奥特Q
  │   ├── 2.mp3   # 初代奥特曼
  │   └── ...
  ├── desc/
  │   ├── 1.mp3   # 奥特Q简介
  │   └── ...
  ├── forms/
  │   ├── 1.mp3   # 奥特Q形态
  │   └── ...
  ├── skills/
  │   ├── 1.mp3   # 奥特Q技能
  │   └── ...
  ├── human/
  │   ├── 1.mp3   # 奥特Q人间体
  │   └── ...
  └── catchphrase/
      ├── 1.mp3   # 奥特Q台词
      └── ...
```

**Modified Files:**
- `src/hooks/useMagicBook.js` - 添加语音播放逻辑
- `src/components/UltramanInfo.jsx` - 点击标签时触发语音

---

## Task 1: Generate Audio Files with edge-TTS

**Files:**
- Create: `scripts/generate-audio.js`
- Create: Shell script to run generation

- [ ] **Step 1: Create audio generation script**

```javascript
// scripts/generate-audio.js
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ultramanData = require('../src/data/ultraman').ultramanData
const infoLabels = require('../src/data/ultraman').infoLabels

const OUTPUT_DIR = path.join(__dirname, '../public/audio')

const voiceMap = {
  name: (item) => item.name,
  desc: (item) => item.desc,
  forms: (item) => item.forms.length > 0 ? item.forms.join('、') : '无多种形态',
  skills: (item) => item.skills.join('、'),
  human: (item) => item.human,
  catchphrase: (item) => item.catchphrase,
}

// Create directories
Object.keys(voiceMap).forEach(key => {
  const dir = path.join(OUTPUT_DIR, key)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
})

// Generate audio using edge-tts
async function generateAudio(type, id, text) {
  const filePath = path.join(OUTPUT_DIR, type, `${id}.mp3`)
  if (fs.existsSync(filePath)) return
  
  const tempFile = path.join(OUTPUT_DIR, type, `${id}.txt`)
  fs.writeFileSync(tempFile, text)
  
  try {
    execSync(`edge-tts --voice "zh-CN-XiaoxiaoNeural" --file "${tempFile}" --write "${filePath}"`, {
      stdio: 'ignore'
    })
    fs.unlinkSync(tempFile)
    console.log(`Generated: ${type}/${id}.mp3`)
  } catch (e) {
    console.error(`Failed: ${type}/${id}`, e.message)
  }
}

async function main() {
  for (const item of ultramanData) {
    for (const [type, fn] of Object.entries(voiceMap)) {
      const text = fn(item)
      if (text) await generateAudio(type, item.id, text)
    }
  }
}

main()
```

- [ ] **Step 2: Run generation script**

```bash
cd /Users/tianyong/Documents/works/workspace/tianyong/Ultraman/ultraman-magic-book
npm install edge-tts
node scripts/generate-audio.js
```

Expected: All audio files generated in `public/audio/`

- [ ] **Step 3: Verify generated files**

```bash
find public/audio -name "*.mp3" | wc -l
```

Expected: 186 (31 × 6 types = 186)

- [ ] **Step 4: Commit**

```bash
git add public/audio scripts/generate-audio.js
git commit -m "feat: add voice audio files"
```

---

## Task 2: Integrate Audio Playback Logic

**Files:**
- Modify: `src/hooks/useMagicBook.js`
- Modify: `src/components/UltramanInfo.jsx`

- [ ] **Step 1: Add audio playback functions to useMagicBook.js**

Add after `playSkill` function:

```javascript
const playAudio = useCallback((type) => {
  if (!soundOn) return
  const audio = new Audio(`/audio/${type}/${currentPage + 1}.mp3`)
  audio.play().catch(() => {})
}, [soundOn, currentPage])

const playTabAudio = useCallback((tabIndex) => {
  if (!soundOn) return
  const typeMap = ['desc', 'forms', 'skills', 'human', 'catchphrase']
  const type = typeMap[tabIndex]
  if (type) {
    const audio = new Audio(`/audio/${type}/${currentPage + 1}.mp3`)
    audio.play().catch(() => {})
  }
}, [soundOn, currentPage])
```

Add to return object:

```javascript
return {
  // ... existing returns
  playAudio,
  playTabAudio,
}
```

- [ ] **Step 2: Integrate page turn audio in Navigation**

Add `playAudio` to `Navigation` props and call on page change

- [ ] **Step 3: Integrate tab click audio in UltramanInfo**

Modify `setActiveTab` callback:

```javascript
const handleTabClick = (idx) => {
  setActiveTab(idx)
  playTabAudio(idx)
}
```

- [ ] **Step 4: Run diagnostics**

```bash
npx eslint src/hooks/useMagicBook.js src/components/UltramanInfo.jsx
```

Expected: No errors

- [ ] **Step 5: Test and commit**

```bash
npm run dev
# Test: open page, click tabs, verify audio plays
git add src/hooks/useMagicBook.js src/components/UltramanInfo.jsx
git commit -m "feat: integrate voice playback"
```

---

## Task 3: Verify and Complete

**Files:**
- Test: `tests/app.spec.js`

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: All tests pass

- [ ] **Step 2: Manual verification**

```bash
npm run dev
# Manual test:
# 1. Open app -> first Ultraman audio should play
# 2. Click next -> next Ultraman audio should play
# 3. Click "简介" tab -> desc audio should play
# 4. Click "形态" tab -> forms audio should play
# 5. Toggle sound off -> no audio should play
```

- [ ] **Step 3: Final commit**

```bash
git add .
git commit -m "feat: complete voice feature"
```

---

## Audio Content Summary

| Type | Content | Count |
|------|---------|-------|
| name | 奥特曼名称 | 31 |
| desc | 简介文字 | 31 |
| forms | 形态列表（无则为"无多种形态"） | 31 |
| skills | 技能列表 | 31 |
| human | 人间体 | 31 |
| catchphrase | 经典台词 | 31 |
| **Total** | | **186** |