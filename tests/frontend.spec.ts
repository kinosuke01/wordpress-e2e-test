import { test, expect } from "@playwright/test";

test.describe("WordPress E2E テスト", () => {
  // ホームページで「Hello world!」が表示されることを確認
  test("ホームページで「Hello world!」が表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('h2:has-text("Hello world!")')).toBeVisible();
  });

  // Hello world! 投稿ページに遷移し、正しい内容が表示されることを確認
  test("Hello world! 投稿ページに遷移し、正しい内容が表示される", async ({
    page,
  }) => {
    await page.goto("/");
    await page.click("text=Hello world!");

    // Check URL contains "hello-world"
    await expect(page).toHaveURL(/.*hello-world.*/);

    // Check post content
    await expect(
      page.locator(
        "text=WordPress へようこそ。こちらは最初の投稿です。編集または削除し、コンテンツ作成を始めてください。"
      )
    ).toBeVisible();
  });

  // サンプルページに遷移し、正しい内容が表示されることを確認
  test("サンプルページに遷移し、正しい内容が表示される", async ({ page }) => {
    await page.goto("/");
    await page.click("text=サンプルページ");

    // Check URL contains "sample-page"
    await expect(page).toHaveURL(/.*sample-page.*/);

    // Check page content
    await expect(page.locator("text=これはサンプルページです。")).toBeVisible();
  });

  // 「hello」で検索し、結果が表示されることを確認
  test("「hello」で検索し、結果が表示される", async ({ page }) => {
    await page.goto("/?s=hello");

    // Check that "Hello world!" is displayed in search results - target the first H2 element
    await expect(
      page.locator('h2:has-text("Hello world!")').first()
    ).toBeVisible();
  });

  // 「bye」で検索し、結果なしメッセージが表示されることを確認
  test("「bye」で検索し、結果なしメッセージが表示される", async ({ page }) => {
    await page.goto("/?s=bye");

    // Check that "no results" message is displayed
    await expect(page.locator("text=何も見つかりませんでした")).toBeVisible();
  });

  // カテゴリページで「未分類」と「Hello world!」が表示されることを確認
  test("カテゴリページで「未分類」と「Hello world!」が表示される", async ({
    page,
  }) => {
    await page.goto("/category/uncategorized");

    // Check that "未分類" is displayed
    await expect(page.locator("text=未分類")).toBeVisible();

    // Check that "Hello world!" is displayed
    await expect(page.locator("text=Hello world!")).toBeVisible();
  });

  // ホームページから投稿、カテゴリへの完全なユーザージャーニーを確認
  test("ホームページから投稿、カテゴリへの完全なユーザージャーニーを完了する", async ({
    page,
  }) => {
    // ホームページから開始
    await page.goto("/");
    await expect(page.locator('h2:has-text("Hello world!")')).toBeVisible();

    // Click on Hello world! post
    await page.click("text=Hello world!");
    await expect(page).toHaveURL(/.*hello-world.*/);
    await expect(
      page.locator(
        "text=WordPress へようこそ。こちらは最初の投稿です。編集または削除し、コンテンツ作成を始めてください。"
      )
    ).toBeVisible();

    // Click on category link
    await page.click("text=未分類");
    await expect(page).toHaveURL(/.*category\/uncategorized.*/);
    await expect(page.locator("text=未分類")).toBeVisible();
    await expect(page.locator("text=Hello world!")).toBeVisible();
  });

  // 検索からの遷移ジャーニーを確認
  test("検索からの遷移ジャーニーを完了する", async ({ page }) => {
    // 「hello」で検索
    await page.goto("/?s=hello");
    await expect(
      page.locator('h2:has-text("Hello world!")').first()
    ).toBeVisible();

    // Click on search result link
    await page.click('h2:has-text("Hello world!") a');
    await expect(page).toHaveURL(/.*hello-world.*/);
    await expect(
      page.locator(
        "text=WordPress へようこそ。こちらは最初の投稿です。編集または削除し、コンテンツ作成を始めてください。"
      )
    ).toBeVisible();
  });

  // サンプルページのナビゲーションを確認
  test("サンプルページのナビゲーションを確認する", async ({ page }) => {
    // サンプルページに遷移
    await page.goto("/");
    await page.click("text=サンプルページ");
    await expect(page).toHaveURL(/.*sample-page.*/);
    await expect(page.locator("text=これはサンプルページです。")).toBeVisible();

    // ホームページに戻る
    await page.goto("/");
    await expect(page).toHaveURL("/");
    await expect(page.locator('h2:has-text("Hello world!")')).toBeVisible();
  });
});
