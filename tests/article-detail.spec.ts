import { test, expect } from '@playwright/test';

test.describe('記事詳細ページ', () => {
  test('記事の詳細ページを表示できる', async ({ page }) => {
    // トップページに遷移
    await page.goto('/');
    
    // 記事タイトルのリンクをクリック（動的に最初の記事を取得）
    await page.getByRole('link', { name: 'Hello world!' }).first().click();
    
    // 記事詳細ページに遷移することを確認
    await expect(page).toHaveURL(/\/2025\/06\/27\/hello-world\//);
    await expect(page).toHaveTitle(/Hello world!/);
    
    // 記事タイトルの確認
    await expect(page.getByRole('heading', { name: 'Hello world!' })).toBeVisible();
    
    // 記事の内容の確認
    await expect(page.getByText('WordPress へようこそ。こちらは最初の投稿です。')).toBeVisible();
    
    // メタ情報の確認
    await expect(page.getByText('執筆者:')).toBeVisible();
    await expect(page.getByRole('link', { name: 'kinosuke01' })).toBeVisible();
    
    await expect(page.getByText('カテゴリ:')).toBeVisible();
    await expect(page.getByRole('link', { name: '未分類' })).toBeVisible();
    
    // 投稿日の確認
    await expect(page.getByText('2025年6月27日')).toBeVisible();
    
    // コメント機能の確認
    await expect(page.getByRole('heading', { name: 'コメント' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'コメントを残す' })).toBeVisible();
    
    // コメントフォームの確認
    await expect(page.getByRole('textbox', { name: 'コメント ※' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '名前 ※' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'メール ※' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'コメントを送信' })).toBeVisible();
  });

  test('カテゴリリンクが正しく機能する', async ({ page }) => {
    // トップページから記事詳細ページに遷移
    await page.goto('/');
    await page.getByRole('link', { name: 'Hello world!' }).first().click();
    
    // カテゴリリンクをクリック
    await page.getByRole('link', { name: '未分類' }).click();
    
    // カテゴリページに遷移することを確認
    await expect(page).toHaveURL(/\/category\/uncategorized\//);
    await expect(page).toHaveTitle(/未分類/);
  });

  test('執筆者リンクが正しく機能する', async ({ page }) => {
    // トップページから記事詳細ページに遷移
    await page.goto('/');
    await page.getByRole('link', { name: 'Hello world!' }).first().click();
    
    // 執筆者リンクをクリック
    await page.getByRole('link', { name: 'kinosuke01' }).click();
    
    // 執筆者ページに遷移することを確認
    await expect(page).toHaveURL(/\/author\/kinosuke01\//);
  });
});