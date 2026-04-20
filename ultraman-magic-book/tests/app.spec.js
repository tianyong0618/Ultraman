import { test, expect } from '@playwright/test';

test.describe('奥特曼魔法书', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('首页加载', async ({ page }) => {
    // 检查封面标题
    await expect(page.locator('.book-cover-title')).toContainText('奥特曼魔法书');
    
    // 检查副标题
    await expect(page.locator('.book-cover-subtitle')).toContainText('ULTRAMAN MAGIC BOOK');
    
    // 检查开始按钮
    await expect(page.locator('.start-button')).toContainText('开启旅程');
  });

  test('点击开始进入书本', async ({ page }) => {
    await page.click('.start-button');
    
    // 检查是否显示书页
    await expect(page.locator('.book-page')).toBeVisible();
    
    // 检查第一页是奥特Q
    await expect(page.locator('.ultraman-name')).toContainText('奥特Q');
  });

  test('翻页功能', async ({ page }) => {
    await page.click('.start-button');
    
    // 点击下一页
    await page.click('.nav-button.next');
    
    // 等待翻页动画
    await page.waitForTimeout(700);
    
    // 检查翻到初代奥特曼
    await expect(page.locator('.ultraman-name')).toContainText('初代奥特曼');
  });

  test('Tab切换', async ({ page }) => {
    await page.click('.start-button');
    
    // 默认显示简介
    await expect(page.locator('.info-text')).toContainText('圆谷首部特摄作品');
    
    // 点击形态Tab
    await page.click('.info-tab:has-text("形态")');
    await expect(page.locator('.forms-list')).toBeVisible();
    
    // 点击技能Tab
    await page.click('.info-tab:has-text("技能")');
    await expect(page.locator('.info-text')).toContainText('无技能数据');
  });

  test('信息展示', async ({ page }) => {
    await page.click('.start-button');
    
    // 检查年份显示
    await expect(page.locator('.ultraman-year')).toContainText('1966');
    
    // 检查时代标签
    await expect(page.locator('.page-left-title')).toContainText('昭和时期');
  });

  test('翻到最后一页', async ({ page }) => {
    await page.click('.start-button');
    
    // 翻到最后一页 (需要翻30次从index 0到index 30)
    for (let i = 0; i < 30; i++) {
      await page.click('.nav-button.next');
      await page.waitForTimeout(600); // 等待翻页动画完成
    }
    
    // 验证当前页面是最后一页 (id=31, index=30)
    const name = await page.locator('.ultraman-name').textContent();
    console.log('最后一页名称:', name);
    expect(['亚刻', '雷欧'].some(n => name.includes(n))).toBe(true);
  });
});
