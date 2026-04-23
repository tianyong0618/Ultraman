# Ultraman Magic Book Design System

Design system for the Ultraman Interactive Encyclopedia (奥特曼魔法书) - a children's web application featuring an ancient magical book UI with 3D page-flip animations.

---

## 1. Visual Theme & Atmosphere

### Design Philosophy
- **古典魔法书风格** (Ancient Magical Book) - Leather-bound tome aesthetic with gold embossing
- **羊皮纸质感** - Parchment-textured pages with subtle gradients
- **儿童友好** - Warm, inviting colors suitable for 4-year-old boys
- **魔法光效** - Glowing effects for skills and transformations

### Mood & Density
- Dense, content-rich layout (like a real encyclopedia)
- High contrast text for readability
- Celebratory, action-oriented (Ultraman heroics)
- Rich visual layering (shadows, gradients, borders)

---

## 2. Color Palette & Roles

### Primary Colors

| Color Name | Hex | Role |
|-----------|-----|------|
| **Magic Black** | `#1a0f0a` | 主背景色 - deep brown-black for depth |
| **Ancient Gold** | `#d4a84b` | 金色边框，标题 - gold embossing effect |
| **Leather Brown** | `#5c3d2e` | 封面，标题背景 - brown leather binding |
| **Parchment** | `#f4e4c1` | 书页背景，卡片 - cream paper texture |
| **Warm White** | `#fffef5` | 文字背景 - off-white for readability |
| **Ink Black** | `#2c1810` | 主要文字 - dark sepia for eyes |
| **Crimson** | `#8b2500` | 强调色，特效 - deep red for actions |
| **Electric Blue** | `#00d4ff` | 发光效果 - cyan glow for energy |
| **Flame Orange** | `#ff6b00` | 技能特效 - orange for skill effects |

### CSS Variables

```css
:root {
  --magic-black: #1a0f0a;
  --ancient-gold: #d4a84b;
  --leather-brown: #5c3d2e;
  --parchment: #f4e4c1;
  --warm-white: #fffef5;
  --ink-black: #2c1810;
  --crimson: #8b2500;
  --electric-blue: #00d4ff;
  --flame-orange: #ff6b00;
}
```

### Color Usage Rules

| Element | Primary Color | Secondary |
|---------|--------------|------------|
| Background | Magic Black | - |
| Cover border | Ancient Gold | Leather Brown |
| Title text | Ancient Gold | - |
| Page background | Parchment | - |
| Primary text | Ink Black | - |
| Buttons | Crimson | Flame Orange |
| Active states | Electric Blue | - |

---

## 3. Typography Rules

### Font Families

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| **主标题** (Book Cover Title) | Cinzel | 48-64px | 700 | 1.2 |
| **章节标题** (Page Titles) | Cinzel | 32px | 600 | 1.3 |
| **卡片标题** (Ultraman Name) | Cinzel | 18-32px | 700 | 1.4 |
| **正文** (Content) | Noto Sans SC | 16px | 400 | 1.6 |
| **说明文字** (Labels) | Noto Sans SC | 14px | 400 | 1.5 |
| **小字** (Small text) | Noto Sans SC | 12px | 400 | 1.4 |

### Font Import

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Noto+Sans+SC:wght@400;600&display=swap');
```

### Typography Hierarchy

```css
--font-title: 'Cinzel', serif;
--font-body: 'Noto Sans SC', sans-serif;
```

### Usage Examples

```css
.book-cover-title {
  font-family: var(--font-title);
  font-size: clamp(32px, 6vw, 64px);
  font-weight: 700;
  color: #f4d03f;
  text-shadow: 0 0 10px rgba(244, 208, 63, 0.5);
}

.ultraman-name {
  font-family: var(--font-title);
  font-size: clamp(18px, 3vw, 32px);
  font-weight: 700;
  color: var(--ink-black);
}

.info-text {
  font-family: var(--font-body);
  font-size: clamp(12px, 1.5vw, 14px);
  line-height: 1.6;
  color: var(--ink-black);
}
```

---

## 4. Component Stylings

### 4.1 BookCover (封面组件)

**Structure:**
- Outer leather frame with gold border
- Decorative corner ornaments
- Title with gold embossing
- Subtitle with decorative separators
- Start button

**Styling:**
```css
.book-cover {
  background: 
    radial-gradient(ellipse at center, #2a1f17 0%, #1a0f0a 100%),
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(212, 168, 75, 0.03) 2px, rgba(212, 168, 75, 0.03) 4px);
  border: 12px solid #8B4513;
  border-radius: 12px;
  box-shadow: 
    0 0 0 3px #5c3d2e,
    0 0 0 6px #3d2817,
    0 0 0 8px #d4a84b,
    inset 0 0 100px rgba(0,0,0,0.6),
    0 0 80px rgba(212, 168, 75, 0.2),
    0 30px 80px rgba(0,0,0,0.9);
}

.book-cover-title {
  font-family: var(--font-title);
  font-size: clamp(32px, 6vw, 64px);
  font-weight: 700;
  color: #f4d03f;
  text-shadow: 
    0 0 10px rgba(244, 208, 63, 0.5),
    0 0 30px rgba(244, 208, 63, 0.3),
    0 2px 4px rgba(0,0,0,0.8),
    2px 2px 0 #8B4513;
  letter-spacing: 0.15em;
}

.start-button {
  font-family: var(--font-title);
  font-size: clamp(18px, 3vw, 28px);
  font-weight: 600;
  color: #1a0f0a;
  background: 
    linear-gradient(180deg, #f4d03f 0%, #d4a84b 50%, #b8923f 100%);
  border: 3px solid #f4d03f;
  border-radius: 12px;
  padding: 20px 56px;
  box-shadow: 
    0 6px 0 #8B4513,
    0 8px 20px rgba(0,0,0,0.5),
    inset 0 1px 0 rgba(255,255,255,0.4);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.start-button:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 8px 0 #8B4513,
    0 12px 30px rgba(0,0,0,0.6),
    0 0 40px rgba(244, 208, 63, 0.3);
}

.start-button:active {
  transform: translateY(2px);
  box-shadow: 
    0 2px 0 #8B4513,
    0 4px 10px rgba(0,0,0,0.4);
}
```

### 4.2 BookPage (书页组件)

**Structure:**
- Left page (image area)
- Right page (info area)
- 3D flip animation

**Styling:**
```css
.book-page {
  background: var(--parchment);
  border: 6px solid var(--leather-brown);
  border-radius: 4px;
  box-shadow: 
    0 0 0 2px var(--ancient-gold),
    0 8px 32px rgba(0,0,0,0.4);
}

.page-left {
  background: linear-gradient(180deg, #e8d8b0 0%, var(--parchment) 20%);
  padding: 24px;
}

.page-right {
  background: var(--parchment);
  padding: 24px;
}

/* 3D Flip Animation */
@keyframes flipOut {
  0% { transform: perspective(800px) rotateY(0deg); transform-origin: left center; }
  30% { transform: perspective(800px) rotateY(-15deg); opacity: 0.8; }
  60% { transform: perspective(800px) rotateY(-25deg); opacity: 0; }
  100% { transform: perspective(800px) rotateY(-30deg); opacity: 0; }
}

@keyframes flipIn {
  0% { transform: perspective(800px) rotateY(30deg); opacity: 0; }
  40% { transform: perspective(800px) rotateY(-15deg); opacity: 0.8; }
  100% { transform: perspective(800px) rotateY(0deg); opacity: 1; }
}
```

### 4.3 UltramanCard (奥特曼卡片)

**Structure:**
- Image thumbnail
- Name (CN/JP/EN)
- Year badge

**Styling:**
```css
.ultraman-image {
  width: 90%;
  height: auto;
  max-height: 80%;
  object-fit: contain;
  filter: drop-shadow(0 4px 16px rgba(0,0,0,0.3));
}

.ultraman-name {
  font-family: var(--font-title);
  font-size: clamp(18px, 3vw, 32px);
  font-weight: 700;
  color: var(--ink-black);
}

.ultraman-year {
  font-size: clamp(12px, 1.5vw, 16px);
  color: var(--leather-brown);
}
```

### 4.4 SkillButton (技能按钮)

**States:**
- Default: Crimson background
- Hover: Flame Orange, scale 1.02
- Active: scale 0.98

**Styling:**
```css
.skill-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--crimson);
  color: var(--warm-white);
  border: 2px solid var(--ancient-gold);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: clamp(11px, 1.3vw, 13px);
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  justify-content: center;
}

.skill-button:hover {
  background: var(--flame-orange);
  transform: scale(1.02);
}

.skill-button:active {
  transform: scale(0.98);
}
```

### 4.5 Navigation (导航组件)

**Styling:**
```css
.nav-button {
  font-size: clamp(32px, 4vw, 48px);
  color: var(--leather-brown);
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.3s;
}

.nav-button:hover {
  opacity: 1;
  color: var(--ancient-gold);
}

.nav-button:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.page-indicator {
  font-family: var(--font-title);
  font-size: 14px;
  color: var(--leather-brown);
}
```

### 4.6 InfoTabs (信息标签页)

**Styling:**
```css
.info-tab {
  font-family: var(--font-body);
  font-size: clamp(10px, 1.2vw, 12px);
  padding: 4px 8px;
  background: var(--leather-brown);
  color: var(--parchment);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s;
}

.info-tab.active {
  opacity: 1;
  background: var(--ancient-gold);
  color: var(--ink-black);
}
```

### 4.7 FormButton (形态按钮)

**Styling:**
```css
.form-button {
  font-size: clamp(10px, 1.2vw, 12px);
  padding: 4px 10px;
  background: var(--electric-blue);
  color: var(--ink-black);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.form-button.active {
  background: var(--crimson);
  color: var(--warm-white);
}
```

---

## 5. Layout Principles

### Spacing Scale

| Token | Value | Usage |
|------|-------|-------|
| `--space-xs` | 4px | Tight spacing |
| `--space-sm` | 8px | Small gaps |
| `--space-md` | 16px | Standard padding |
| `--space-lg` | 24px | Section margins |
| `--space-xl` | 32px | Large gaps |
| `--space-2xl` | 48px | Major sections |

### Grid System

- Base unit: 8px
- Content max-width: 1200px
- Card grid gap: 16px

### Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Single column, stacked pages |
| Tablet | 768px - 1024px | 2 column grid |
| Desktop | > 1024px | Full 3D book layout |

### Layout Structure

```
App
└── MagicBook
    ├── BookCover (封面)
    │   ├── Corners (装饰角)
    │   ├── Title
    │   └── StartButton
    └── BookPages (书页)
        ├── Navigation (翻页按钮)
        ├── BookPage
        │   ├── PageLeft (图像)
        │   └── PageRight (信息)
        │       ├── UltramanName
        │       ├── InfoTabs
        │       ├── InfoContent
        │       └── SkillsSection
        └── Indicator (页码)
```

---

## 6. Depth & Elevation

### Shadow System

| Level | CSS | Usage |
|-------|-----|-------|
| **Subtle** | `0 0 0 2px var(--ancient-gold)` | Page border |
| **Medium** | `0 8px 32px rgba(0,0,0,0.4)` | Page depth |
| **Strong** | `0 30px 80px rgba(0,0,0,0.9)` | Cover shadow |
| **Glow** | `0 0 40px rgba(244, 208, 63, 0.3)` | Gold glow |

### Animation Effects

| Animation | Description | Duration |
|-----------|-------------|----------|
| `coverAppear` | 3D cover entrance | 1.2s |
| `flipOut` | Page flip out | 0.35s |
| `flipIn` | Page flip in | 0.35s |
| `starGlow` | Ornament glow pulse | 3s |
| `rotateSlow` | Decorative rotation | 30s |

### Transitions

- Button hover: `all 0.3s ease`
- Page flip: `0.6s ease-in-out`
- Cover animation: `1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)`

---

## 7. Do's and Don'ts

### DO

- ✅ Use Cinzel for all titles and headings
- ✅ Use Noto Sans SC for body text
- ✅ Apply gold border to cover
- ✅ Use parchment for page backgrounds
- ✅ Include 3D flip animations for page navigation
- ✅ Add glow effects to skill buttons on hover
- ✅ Support touch swipe on mobile
- ✅ Maintain responsive breakpoints

### DON'T

- ❌ Use pure black (#000000) - use Magic Black (#1a0f0a)
- ❌ Use pure white (#FFFFFF) - use Warm White (#fffef5)
- ❌ Skip the leather texture on cover
- ❌ Remove gold accents from borders
- ❌ Use different fonts without updating Design System
- ❌ Remove page flip animations
- ❌ Use flat colors without gradients
- ❌ Make UI too dark for children

### Design Guardrails

| Rule | Reason |
|------|--------|
| Minimum contrast 4.5:1 | Accessibility for children |
| Touch targets ≥ 44px | Mobile usability |
| Animation ≤ 1.2s | Don't overwhelm users |
| Max 3 active animations | Performance |

---

## 8. Responsive Behavior

### Mobile (< 768px)

- Single column layout
- Stacked pages (image top, info bottom)
- Touch swipe enabled
- Smaller fonts
- Thinner borders

### Tablet (768px - 1024px)

- 2 column card grid
- Partial page view
- Medium fonts

### Desktop (> 1024px)

- Full 3D book layout
- Side-by-side pages
- All animations enabled
- Hover states visible

---

## 9. Agent Prompt Guide

### Quick Color Reference

```
Magic Black     #1a0f0a  (background)
Ancient Gold   #d4a84b  (borders, titles)
Leather Brown   #5c3d2e  (cover, tabs)
Parchment      #f4e4c1  (page background)
Ink Black      #2c1810  (text)
Crimson        #8b2500  (skill buttons)
Electric Blue #00d4ff  (glow effects)
Flame Orange   #ff6b00  (skill hover)
```

### Ready-to-Use Prompts

**Create a new component:**
```
Build a BookCard component using Ultraman Magic Book DESIGN.md.
- Use Cinzel font for title
- Gold border on hover
- Parchment background
- 3D lift effect
```

**Style a button:**
```
Style a skill button that glows orange on hover.
- Use Crimson base (#8b2500)
- Flame Orange hover (#ff6b00)
- Gold border
- Scale transform
```

**Create page layout:**
```
Layout a book page following DESIGN.md.
- 50/50 split (image/info)
- Parchment background
- Leather border
- Gold inner border
```

---

## 10. Implementation Files

| File | Purpose |
|------|---------|
| `src/index.css` | Global styles with CSS variables |
| `src/App.jsx` | Main application |
| `src/components/` | UI components |
| `preview.html` | Visual style catalog |
| `preview-dark.html` | Dark variant preview |

---

## 11. Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-04-20 | Initial Design System | - |