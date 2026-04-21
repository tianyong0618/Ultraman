# 奥特曼魔法书 (Ultraman Magic Book)

为4岁男孩创建的纯前端奥特曼交互系统，按时间顺序展示31个奥特曼（1966-2024），古典魔法书形式呈现。

## 启动方式

### 方式一：启动脚本（推荐）
```bash
./scripts/start-dev.sh
```
访问：http://localhost:5173/

### 方式二：npm
```bash
cd ultraman-magic-book
npm install
npm run dev
```
访问：http://localhost:5173/

### 方式三：Python（直接运行dist）
```bash
npm run build
python3 -m http.server 9000 --directory dist
```
访问：http://localhost:9000/

## 功能

- 31个奥特曼完整数据（1966-2024）
- 古典魔法书UI风格
- 左页：奥特曼图片
- 右页：信息展示（简介/形态/技能/人间体/台词）
- 形态切换
- 翻页方式：按钮点击 + 手势滑动（桌面端鼠标拖拽 / 移动端触摸滑动手势）

## 技术栈

- React + Vite
- 纯前端静态网站
