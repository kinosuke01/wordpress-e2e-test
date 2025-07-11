import { test, expect } from '@playwright/test';

test.describe('検索機能', () => {
  test('検索で絞り込みが出来る', async ({ page }) => {
    // 検索結果ページに直接遷移
    await page.goto('/?s=hello');
    
    // ページタイトルの確認
    await expect(page).toHaveTitle(/"hello" の検索結果/);
    
    // 検索結果ページのヘッダーの確認
    await expect(page.getByRole('heading', { name: /検索結果.*hello/ })).toBeVisible();
    
    // 検索フォームの確認
    await expect(page.getByRole('searchbox', { name: '検索' })).toBeVisible();
    await expect(page.getByRole('searchbox', { name: '検索' })).toHaveValue('hello');
    
    // 検索ボタンの確認
    await expect(page.getByRole('button', { name: '検索' })).toBeVisible();
    
    // 検索結果の確認
    await expect(page.getByRole('heading', { name: 'Hello world!' })).toBeVisible();
    await expect(page.getByText('WordPress へようこそ。こちらは最初の投稿です。')).toBeVisible();
    
    // 投稿日の確認
    await expect(page.getByText('2025年6月27日')).toBeVisible();
  });

  test('検索結果から記事詳細ページに遷移できる', async ({ page }) => {
    await page.goto('/?s=hello');
    
    // 記事タイトルのリンクをクリック
    await page.getByRole('link', { name: 'Hello world!' }).first().click();
    
    // 記事詳細ページに遷移することを確認
    await expect(page).toHaveURL(/\/2025\/06\/27\/hello-world\//);
    await expect(page).toHaveTitle(/Hello world!/);
    await expect(page.getByRole('heading', { name: 'Hello world!' })).toBeVisible();
  });

  test('検索フォームを使って検索できる', async ({ page }) => {
    await page.goto('/?s=hello');
    
    // 検索フォームをクリアして新しい検索語を入力
    await page.getByRole('searchbox', { name: '検索' }).clear();
    await page.getByRole('searchbox', { name: '検索' }).fill('WordPress');
    
    // 検索ボタンをクリック
    await page.getByRole('button', { name: '検索' }).click();
    
    // 検索結果ページに遷移することを確認
    await expect(page).toHaveURL(/\?s=WordPress/);
    await expect(page).toHaveTitle(/"WordPress" の検索結果/);
    await expect(page.getByRole('heading', { name: /検索結果.*WordPress/ })).toBeVisible();
  });

  test('検索結果がない場合の処理', async ({ page }) => {
    // 存在しない検索語で検索
    await page.goto('/?s=nonexistent');
    
    // 検索結果ページに遷移することを確認
    await expect(page).toHaveURL(/\?s=nonexistent/);
    await expect(page).toHaveTitle(/"nonexistent" の検索結果/);
    await expect(page.getByRole('heading', { name: /検索結果.*nonexistent/ })).toBeVisible();
    
    // 検索フォームは表示されることを確認
    await expect(page.getByRole('searchbox', { name: '検索' })).toBeVisible();
    await expect(page.getByRole('searchbox', { name: '検索' })).toHaveValue('nonexistent');
  });
});