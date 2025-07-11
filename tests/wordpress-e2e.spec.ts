import { test, expect } from '@playwright/test';

test.describe('WordPress E2E Tests', () => {
  const baseUrl = 'https://pochibukuro.info/20250627/';

  test('should display "Hello world!" on homepage', async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page.locator('h2:has-text("Hello world!")')).toBeVisible();
  });

  test('should navigate to hello-world post page and display correct content', async ({ page }) => {
    await page.goto(baseUrl);
    await page.click('text=Hello world!');
    
    // Check URL contains "hello-world"
    await expect(page).toHaveURL(/.*hello-world.*/);
    
    // Check post content
    await expect(page.locator('text=WordPress へようこそ。こちらは最初の投稿です。編集または削除し、コンテンツ作成を始めてください。')).toBeVisible();
  });

  test('should navigate to sample page and display correct content', async ({ page }) => {
    await page.goto(baseUrl);
    await page.click('text=サンプルページ');
    
    // Check URL contains "sample-page"
    await expect(page).toHaveURL(/.*sample-page.*/);
    
    // Check page content
    await expect(page.locator('text=これはサンプルページです。')).toBeVisible();
  });

  test('should search for "hello" and display results', async ({ page }) => {
    await page.goto(`${baseUrl}?s=hello`);
    
    // Check that "Hello world!" is displayed in search results - target the first H2 element
    await expect(page.locator('h2:has-text("Hello world!")').first()).toBeVisible();
  });

  test('should search for "bye" and display no results message', async ({ page }) => {
    await page.goto(`${baseUrl}?s=bye`);
    
    // Check that "no results" message is displayed
    await expect(page.locator('text=何も見つかりませんでした')).toBeVisible();
  });

  test('should display category page with "未分類" and "Hello world!"', async ({ page }) => {
    await page.goto(`${baseUrl}category/uncategorized`);
    
    // Check that "未分類" is displayed
    await expect(page.locator('text=未分類')).toBeVisible();
    
    // Check that "Hello world!" is displayed
    await expect(page.locator('text=Hello world!')).toBeVisible();
  });

  test('should complete full user journey from homepage to post to category', async ({ page }) => {
    // Start at homepage
    await page.goto(baseUrl);
    await expect(page.locator('h2:has-text("Hello world!")')).toBeVisible();
    
    // Click on Hello world! post
    await page.click('text=Hello world!');
    await expect(page).toHaveURL(/.*hello-world.*/);
    await expect(page.locator('text=WordPress へようこそ。こちらは最初の投稿です。編集または削除し、コンテンツ作成を始めてください。')).toBeVisible();
    
    // Click on category link
    await page.click('text=未分類');
    await expect(page).toHaveURL(/.*category\/uncategorized.*/);
    await expect(page.locator('text=未分類')).toBeVisible();
    await expect(page.locator('text=Hello world!')).toBeVisible();
  });

  test('should complete search journey', async ({ page }) => {
    // Search for "hello"
    await page.goto(`${baseUrl}?s=hello`);
    await expect(page.locator('h2:has-text("Hello world!")').first()).toBeVisible();
    
    // Click on search result link
    await page.click('h2:has-text("Hello world!") a');
    await expect(page).toHaveURL(/.*hello-world.*/);
    await expect(page.locator('text=WordPress へようこそ。こちらは最初の投稿です。編集または削除し、コンテンツ作成を始めてください。')).toBeVisible();
  });

  test('should verify sample page navigation', async ({ page }) => {
    // Navigate to sample page
    await page.goto(baseUrl);
    await page.click('text=サンプルページ');
    await expect(page).toHaveURL(/.*sample-page.*/);
    await expect(page.locator('text=これはサンプルページです。')).toBeVisible();
    
    // Navigate back to homepage
    await page.click('text=きのすけのサイト');
    await expect(page).toHaveURL(baseUrl);
    await expect(page.locator('h2:has-text("Hello world!")')).toBeVisible();
  });
});