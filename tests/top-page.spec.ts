import { test, expect } from '@playwright/test';

test.describe('トップページ', () => {
  test('トップページを表示できる', async ({ page }) => {
    // トップページに遷移
    await page.goto('/');
    
    // ページタイトルの確認
    await expect(page).toHaveTitle(/きのすけのサイト/);
    
    // メインヘッダーの確認
    await expect(page.locator('h1')).toHaveText('ブログ');
    
    // サイトロゴ/名前の確認
    await expect(page.getByRole('link', { name: 'きのすけのサイト' })).toBeVisible();
    
    // ナビゲーションメニューの確認
    await expect(page.getByRole('link', { name: 'サンプルページ' })).toBeVisible();
    
    // 記事一覧の確認
    await expect(page.getByRole('heading', { name: 'Hello world!' })).toBeVisible();
    
    // 記事の投稿日の確認
    await expect(page.getByText('2025年6月27日')).toBeVisible();
    
    // フッターの確認
    await expect(page.getByText('Twenty Twenty-Five')).toBeVisible();
    await expect(page.getByRole('link', { name: 'WordPress' })).toBeVisible();
  });

  test('記事へのリンクが正しく機能する', async ({ page }) => {
    await page.goto('/');
    
    // 記事タイトルのリンクをクリック
    await page.getByRole('link', { name: 'Hello world!' }).first().click();
    
    // 記事詳細ページに遷移することを確認
    await expect(page).toHaveURL(/\/2025\/06\/27\/hello-world\//);
    await expect(page).toHaveTitle(/Hello world!/);
  });
});