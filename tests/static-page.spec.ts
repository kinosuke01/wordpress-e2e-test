import { test, expect } from '@playwright/test';

test.describe('固定ページ', () => {
  test('固定ページが表示される', async ({ page }) => {
    // 固定ページに直接遷移
    await page.goto('/sample-page/');
    
    // ページタイトルの確認
    await expect(page).toHaveTitle(/サンプルページ/);
    
    // ページヘッダーの確認
    await expect(page.getByRole('heading', { name: 'サンプルページ' })).toBeVisible();
    
    // ページの内容の確認
    await expect(page.getByText('これはサンプルページです。')).toBeVisible();
    await expect(page.getByText('はじめまして。昼間はバイク便のメッセンジャーとして働いていますが')).toBeVisible();
    await expect(page.getByText('XYZ 小道具株式会社は1971年の創立以来')).toBeVisible();
    
    // ダッシュボードリンクの確認
    await expect(page.getByRole('link', { name: 'ダッシュボード' })).toBeVisible();
    
    // サイトロゴ/名前の確認
    await expect(page.getByRole('link', { name: 'きのすけのサイト' })).toBeVisible();
    
    // ナビゲーションメニューの確認
    await expect(page.getByRole('link', { name: 'サンプルページ' })).toBeVisible();
  });

  test('固定ページからトップページに遷移できる', async ({ page }) => {
    await page.goto('/sample-page/');
    
    // サイトロゴ/名前をクリック
    await page.getByRole('link', { name: 'きのすけのサイト' }).first().click();
    
    // トップページに遷移することを確認
    await expect(page.url()).toMatch(/pochibukuro\.info\/20250627\/?$/);
    await expect(page).toHaveTitle(/きのすけのサイト/);
    await expect(page.getByRole('heading', { name: 'ブログ' })).toBeVisible();
  });

  test('ナビゲーションメニューから固定ページに遷移できる', async ({ page }) => {
    // トップページから固定ページに遷移
    await page.goto('/');
    
    // ナビゲーションメニューの「サンプルページ」をクリック
    await page.getByRole('link', { name: 'サンプルページ' }).click();
    
    // 固定ページに遷移することを確認
    await expect(page).toHaveURL(/\/sample-page\//);
    await expect(page).toHaveTitle(/サンプルページ/);
    await expect(page.getByRole('heading', { name: 'サンプルページ' })).toBeVisible();
  });
});