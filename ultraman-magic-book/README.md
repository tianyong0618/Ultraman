# 奥特曼魔法书 (Ultraman Magic Book)

为4岁男孩创建的纯前端奥特曼交互系统，按时间顺序展示31个奥特曼（1966-2024），古典魔法书形式呈现。

## 启动方式

### 方式一：npm（推荐）
```bash
cd ultraman-magic-book
npm install
npm run dev
```
访问：http://localhost:5173/

### 方式二：Python（直接运行dist）
```bash
# 构建
npm run build

# 启动Python服务器
python3 -m http.server 9000 --directory dist
```
访问：http://localhost:9000/

## 功能

- 31个奥特曼完整数据（1966-2024）
- 古典魔法书UI风格
- 左页：奥特曼图片
- 右页：信息展示（简介/形态/技能/人间体/台词）
- 形态切换
- 翻页动画（桌面端：半页3D翻页；移动端：整页3D翻页）

## 技术栈

- React + Vite
- 纯前端静态网站
