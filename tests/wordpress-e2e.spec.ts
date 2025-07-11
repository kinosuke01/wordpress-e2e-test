import { test, expect } from '@playwright/test';

const BASE_URL = 'https://pochibukuro.info/20250627';

test.describe('WordPress E2E Tests', () => {
  test('トップページを表示できる', async ({ page }) => {
    await page.goto(BASE_URL);
    
    await expect(page).toHaveTitle(/きのすけのサイト/);
    await expect(page.getByRole('heading', { name: 'ブログ' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'きのすけのサイト' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'サンプルページ' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Hello world!' }).first()).toBeVisible();
    await expect(page.getByText('WordPress へようこそ。こちらは最初の投稿です。')).toBeVisible();
    await expect(page.getByText('2025年6月27日')).toBeVisible();
    await expect(page.getByText('Twenty Twenty-Five')).toBeVisible();
  });

  test('記事の詳細ページを表示できる', async ({ page }) => {
    await page.goto(`${BASE_URL}/2025/06/27/hello-world/`);
    
    await expect(page).toHaveTitle(/Hello world!/);
    await expect(page.getByRole('heading', { name: 'Hello world!' }).first()).toBeVisible();
    await expect(page.getByText('WordPress へようこそ。こちらは最初の投稿です。')).toBeVisible();
    await expect(page.getByText('執筆者:')).toBeVisible();
    await expect(page.getByRole('link', { name: 'kinosuke01' })).toBeVisible();
    await expect(page.getByText('カテゴリ:')).toBeVisible();
    await expect(page.getByRole('link', { name: '未分類' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'コメント' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'コメントを残す' })).toBeVisible();
  });

  test('カテゴリで絞った記事の一覧ページを表示できる', async ({ page }) => {
    await page.goto(`${BASE_URL}/category/uncategorized/`);
    
    await expect(page).toHaveTitle(/未分類/);
    await expect(page.getByRole('heading', { name: /カテゴリー.*未分類/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Hello world!' }).first()).toBeVisible();
    await expect(page.getByText('WordPress へようこそ。こちらは最初の投稿です。')).toBeVisible();
    await expect(page.getByText('2025年6月27日')).toBeVisible();
  });

  test('固定ページが表示される', async ({ page }) => {
    await page.goto(`${BASE_URL}/sample-page/`);
    
    await expect(page).toHaveTitle(/サンプルページ/);
    await expect(page.getByRole('heading', { name: 'サンプルページ' })).toBeVisible();
    await expect(page.getByText('これはサンプルページです。')).toBeVisible();
    await expect(page.getByText('はじめまして。昼間はバイク便のメッセンジャーとして働いていますが')).toBeVisible();
    await expect(page.getByText('XYZ 小道具株式会社は1971年の創立以来')).toBeVisible();
    await expect(page.getByRole('link', { name: 'ダッシュボード' })).toBeVisible();
  });

  test('検索で絞り込みが出来る', async ({ page }) => {
    await page.goto(`${BASE_URL}/?s=hello`);
    
    await expect(page).toHaveTitle(/“hello” の検索結果.*きのすけのサイト/);
    await expect(page.getByRole('heading', { name: /検索結果.*hello/ })).toBeVisible();
    await expect(page.getByRole('searchbox', { name: '検索' })).toBeVisible();
    await expect(page.getByRole('searchbox', { name: '検索' })).toHaveValue('hello');
    await expect(page.getByRole('button', { name: '検索' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Hello world!' }).first()).toBeVisible();
    await expect(page.getByText('WordPress へようこそ。こちらは最初の投稿です。')).toBeVisible();
  });

  test('リンクナビゲーションが正常に動作する', async ({ page }) => {
    // トップページから記事詳細ページへ
    await page.goto(BASE_URL);
    await page.getByRole('link', { name: 'Hello world!' }).first().click();
    await expect(page).toHaveURL(/\/2025\/06\/27\/hello-world\//);
    
    // 記事詳細ページからカテゴリページへ
    await page.getByRole('link', { name: '未分類' }).click();
    await expect(page).toHaveURL(/\/category\/uncategorized\//);
    
    // カテゴリページからトップページへ
    await page.getByRole('link', { name: 'きのすけのサイト' }).first().click();
    await expect(page.url()).toMatch(/pochibukuro\.info\/20250627\/?$/);
    
    // トップページから固定ページへ
    await page.getByRole('link', { name: 'サンプルページ' }).click();
    await expect(page).toHaveURL(/\/sample-page\//);
  });

  test('検索機能が動作する', async ({ page }) => {
    await page.goto(`${BASE_URL}/?s=hello`);
    
    // 検索フォームを使って新しい検索を実行
    await page.getByRole('searchbox', { name: '検索' }).clear();
    await page.getByRole('searchbox', { name: '検索' }).fill('WordPress');
    await page.getByRole('button', { name: '検索' }).click();
    
    await expect(page).toHaveURL(/\?s=WordPress/);
    await expect(page).toHaveTitle(/“WordPress” の検索結果.*きのすけのサイト/);
    await expect(page.getByRole('heading', { name: /検索結果.*WordPress/ })).toBeVisible();
  });
});