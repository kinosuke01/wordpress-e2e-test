import { test, expect } from '@playwright/test';

test.describe('カテゴリページ', () => {
  test('カテゴリで絞った記事の一覧ページを表示できる', async ({ page }) => {
    // カテゴリページに直接遷移
    await page.goto('/category/uncategorized/');
    
    // ページタイトルの確認
    await expect(page).toHaveTitle(/未分類/);
    
    // カテゴリページのヘッダーの確認
    await expect(page.getByRole('heading', { name: /カテゴリー.*未分類/ })).toBeVisible();
    
    // 記事一覧の確認
    await expect(page.getByRole('heading', { name: 'Hello world!' })).toBeVisible();
    
    // 記事の内容の確認
    await expect(page.getByText('WordPress へようこそ。こちらは最初の投稿です。')).toBeVisible();
    
    // 投稿日の確認
    await expect(page.getByText('2025年6月27日')).toBeVisible();
    
    // サイトロゴ/名前の確認
    await expect(page.getByRole('link', { name: 'きのすけのサイト' })).toBeVisible();
  });

  test('カテゴリページから記事詳細ページに遷移できる', async ({ page }) => {
    await page.goto('/category/uncategorized/');
    
    // 記事タイトルのリンクをクリック
    await page.getByRole('link', { name: 'Hello world!' }).first().click();
    
    // 記事詳細ページに遷移することを確認
    await expect(page).toHaveURL(/\/2025\/06\/27\/hello-world\//);
    await expect(page).toHaveTitle(/Hello world!/);
    await expect(page.getByRole('heading', { name: 'Hello world!' })).toBeVisible();
  });

  test('動的にカテゴリページに遷移できる', async ({ page }) => {
    // トップページから記事詳細ページに遷移
    await page.goto('/');
    await page.getByRole('link', { name: 'Hello world!' }).first().click();
    
    // カテゴリリンクをクリック
    await page.getByRole('link', { name: '未分類' }).click();
    
    // カテゴリページに遷移することを確認
    await expect(page).toHaveURL(/\/category\/uncategorized\//);
    await expect(page).toHaveTitle(/未分類/);
    await expect(page.getByRole('heading', { name: /カテゴリー.*未分類/ })).toBeVisible();
  });
});