# 全家福页面布局修改计划 - 按活跃度分布

> **目标:** 将全家福页面的随机布局改为按活跃度（关系数量）分布，热门英雄在中间，冷门英雄在外围，营造由近及远的纵深感

**当前问题:** 头像位置完全随机，热门和冷门英雄混杂一起，缺乏层次感

**解决方案:** 采用同心圆分层布局，按关系数量分层，热门居中，尺寸最大

---

## 修改文件

- `src/components/FamilyPortrait.jsx` - 修改 `generatePositions` 函数

---

## 任务清单

### Task 1: 计算每个英雄的活跃度

- [ ] **Step 1: 分析关系数据获取活跃度**

```javascript
// 计算每个英雄的关系数量
function calculatePopularity() {
  const popularity = {}
  
  // 初始化所有ID为0
  ultramanData.forEach(u => {
    popularity[u.id] = 0
  })
  
  // 统计每个英雄的关联数量
  ultramanRelations.forEach(rel => {
    popularity[rel.id] = (popularity[rel.id] || 0) + rel.relatedIds.length
    rel.relatedIds.forEach(targetId => {
      popularity[targetId] = (popularity[targetId] || 0) + 1
    })
  })
  
  return popularity
}
```

- [ ] **Step 2: 运行分析**

运行: 构建项目观察控制台输出
预期: 无错误

- [ ] **Step 3: 提交**

```bash
git add src/components/FamilyPortrait.jsx
git commit -m "feat: 添加活跃度计算函数"
```

---

### Task 2: 实现同心圆分层布局算法

- [ ] **Step 1: 编写分层定位算法**

```javascript
function generatePositionsByPopularity(count, popularityData) {
  const positions = []
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  
  // 定义层级: [最小关系数阈值, 最大关系数阈值, 尺寸, 距离中心比例]
  const layers = [
    { min: 2, max: 10, size: 72, ratio: 0.15 },  // 热门: 关系>=2
    { min: 1, max: 1, size: 56, ratio: 0.35 },   // 一般: 关系=1
    { min: 0, max: 0, size: 40, ratio: 0.60 },    // 冷门: 关系=0
  ]
  
  // 为每个位置分配层级和随机角度
  const分配 = ultramanData.map((u, idx) => {
    const pop = popularity[u.id] || 0
    const layer = layers.find(l => pop >= l.min && pop <= l.max)
    
    return {
      idx,
      id: u.id,
      popularity: pop,
      layer,
      // 使用固定顺序的角度，确保不一致
      angle: (idx / count) * Math.PI * 2 + (Math.random() * 0.5),
    }
  })
  
  // 按层级排序: 热门在内圈
 分配.sort((a, b) => b.popularity - a.popularity)
  
  // 生成坐标
 分配.forEach((item, i) => {
    const layer = item.layer
    const distance = Math.min(centerX, centerY) * layer.ratio
    const angle = item.angle
    
    positions.push({
      x: centerX + Math.cos(angle) * distance - AVATAR_SIZE / 2,
      y: centerY + Math.sin(angle) * distance - AVATAR_SIZE / 2,
    })
  })
  
  return positions
}
```

- [ ] **Step 2: 更新组件使用新算法**

替换原 `generatePositions` 调用为 `generatePositionsByPopularity`

- [ ] **Step 3: 运行验证**

运行: `npm run build`
预期: 编译成功

- [ ] **Step 4: 提交**

```bash
git add src/components/FamilyPortrait.jsx
git commit -m "feat: 实现基于活跃度的同心圆布局"
```

---

### Task 3: 添加尺寸动态变化增强纵深感

- [ ] **Step 1: 添加CSS变量控制尺寸**

```javascript
// 在 getAvatarClass 中添加动态尺寸
style={{
  left: pos.x,
  top: pos.y,
  '--avatar-color': ultraman.color,
  '--avatar-size': `${layer.size}px`,
  transform: 'translate(-50%, -50%)', // 居中定位
}}
```

- [ ] **Step 2: 更新CSS样式**

```css
.family-portrait .avatar {
  width: var(--avatar-size, 48px);
  height: var(--avatar-size, 48px);
  transform: translate(-50%, -50%);
}
```

- [ ] **Step 3: 运行验证**

运行: `npm run build`
预期: 编译成功

- [ ] **Step 4: 提交**

```bash
git add src/components/FamilyPortrait.jsx src/index.css
git commit -m "feat: 添加头像尺寸动态变化"
```

---

### Task 4: 验证整体效果

- [ ] **Step 1: 启动开发服务器**

运行: `npm run dev`

- [ ] **Step 2: 手动验证**
- 打开全家福页面
- 确认热门英雄（迪迦、戴拿、盖亚）在中心且尺寸最大
- 确认冷门英雄在外围且尺寸较小
- 确认点击头像能正常跳转

- [ ] **Step 3: 运行测试**

运行: `npm test`
预期: 全部通过

- [ ] **Step 4: 提交**

```bash
git add .
git commit -m "fix: 验证全家福布局修改"
```

---

## 验证清单

- [ ] 热门英雄（迪迦/戴拿/盖亚）位于中心区域
- [ ] 尺寸按层级: 热门>一般>冷门
- [ ] 头像之间无重叠
- [ ] 筛选模式正常工作
- [ ] 关系连线正确显示